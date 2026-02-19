import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Indexer } from "@0glabs/0g-ts-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

function getEnv(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

// --- tiny local fallback summarizer (deterministic, no external deps) ---
function localSummarize(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean
    .split(/(?<=[.?!])\s+/)
    .filter(Boolean);

  const summary = sentences.slice(0, 3).join(" ").slice(0, 800);

  const bullets = [];
  for (let i = 0; i < Math.min(5, sentences.length); i++) {
    const s = sentences[i].replace(/^[-•\s]+/, "").trim();
    if (s.length) bullets.push(s.slice(0, 140));
  }

  return {
    summary: summary || clean.slice(0, 300),
    bullets: bullets.length ? bullets : [clean.slice(0, 140)],
    timestamp: new Date().toISOString(),
    mode: "local-fallback"
  };
}

async function tryComputeEndpoint(text) {
  const COMPUTE_URL = process.env.COMPUTE_URL?.trim();
  if (!COMPUTE_URL) return null;

  // Expecting your endpoint to accept JSON { text } and return { summary, bullets }
  const res = await fetch(COMPUTE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    throw new Error(`Compute endpoint HTTP ${res.status}`);
  }

  const json = await res.json();

  // Minimal validation
  if (!json?.summary || !Array.isArray(json?.bullets)) {
    throw new Error("Compute endpoint returned invalid shape (need summary + bullets[])");
  }

  return {
    summary: json.summary,
    bullets: json.bullets,
    timestamp: new Date().toISOString(),
    mode: "compute-endpoint"
  };
}

async function main() {
  const RPC_URL = requireEnv("RPC_URL");
  const INDEXER_RPC = requireEnv("INDEXER_RPC");

  // Where Lesson 2 stored the input CID
  const inputCidArtifact = getEnv(
    "INPUT_CID_ARTIFACT",
    path.resolve(__dirname, "..", "..", "lesson-2-upload-storage", "artifacts", "inputCid.json")
  );

  if (!fs.existsSync(inputCidArtifact)) {
    throw new Error(
      `Could not find input CID artifact.\nExpected: ${inputCidArtifact}\nRun Lesson 2 upload first.`
    );
  }

  const { rootHash } = JSON.parse(fs.readFileSync(inputCidArtifact, "utf-8"));
  if (!rootHash) throw new Error("inputCid.json missing rootHash");

  console.log("Input rootHash (CID):", rootHash);

  // Download the input text from 0G storage to a tmp file
  const indexer = new Indexer(INDEXER_RPC);
  const tmpDir = path.resolve(__dirname, "..", "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const downloadedPath = path.join(tmpDir, `input-${rootHash.slice(0, 10)}.txt`);
  console.log("Downloading input to:", downloadedPath);

  // TS starter kit shows: indexer.download(rootHash, outputPath, true) :contentReference[oaicite:1]{index=1}
  const downloadErr = await indexer.download(rootHash, downloadedPath, true);
  if (downloadErr) throw new Error(`Download error: ${downloadErr}`);

  const inputText = fs.readFileSync(downloadedPath, "utf-8");

  console.log(`Downloaded input chars: ${inputText.length}`);

  // Try real compute endpoint, else mock file, else local fallback summarizer
  let output;

  try {
    output = await tryComputeEndpoint(inputText);
    if (output) {
      console.log("✅ Compute used endpoint:", process.env.COMPUTE_URL);
    }
  } catch (e) {
    console.log("⚠️ Compute endpoint failed, will fallback:", e?.message ?? e);
  }

  if (!output) {
    const mockPath = path.resolve(__dirname, "..", "mock", "output.json");
    if (fs.existsSync(mockPath)) {
      output = JSON.parse(fs.readFileSync(mockPath, "utf-8"));
      output.timestamp = new Date().toISOString();
      output.mode = output.mode || "mock-file";
      console.log("✅ Compute used mock/output.json");
    } else {
      output = localSummarize(inputText);
      console.log("✅ Compute used local fallback summarizer");
    }
  }

  // Save compute output artifact
  const artifactsDir = path.resolve(__dirname, "..", "artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const outPath = path.join(artifactsDir, "computeOutput.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        inputRootHash: rootHash,
        ...output
      },
      null,
      2
    )
  );

  console.log("\nSaved compute output:", outPath);
  console.log("Summary preview:", (output.summary || "").slice(0, 140), "...");
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
