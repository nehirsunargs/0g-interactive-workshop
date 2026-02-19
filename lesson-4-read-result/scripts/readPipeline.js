import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ethers } from "ethers";
import { Indexer } from "@0glabs/0g-ts-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function prettyPrintOutput(outputText) {
  const json = safeJsonParse(outputText);
  if (!json) {
    console.log("\n--- Output (raw) ---\n");
    console.log(outputText.slice(0, 5000));
    if (outputText.length > 5000) console.log("\n...(truncated)");
    return;
  }

  console.log("\n--- Output (parsed) ---\n");
  if (json.summary) console.log("Summary:\n", json.summary, "\n");

  if (Array.isArray(json.bullets)) {
    console.log("Bullets:");
    for (const b of json.bullets) console.log(" -", b);
    console.log();
  }

  if (json.timestamp) console.log("Timestamp:", json.timestamp);
  if (json.mode) console.log("Mode:", json.mode);
}

async function downloadText(indexer, cid, outPath) {
  const err = await indexer.download(cid, outPath, true);
  if (err) throw new Error(`Download failed for ${cid}: ${err}`);
  return fs.readFileSync(outPath, "utf-8");
}

async function main() {
  const RPC_URL = requireEnv("RPC_URL");
  const INDEXER_RPC = requireEnv("INDEXER_RPC");
  const CONTRACT_ADDRESS = requireEnv("CONTRACT_ADDRESS");

  // Read from contract (provider-only)
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Minimal ABI for reads
  const abi = [
    "function inputCid() view returns (string)",
    "function outputCid() view returns (string)"
  ];

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  console.log("RPC_URL:", RPC_URL);
  console.log("INDEXER_RPC:", INDEXER_RPC);
  console.log("Contract:", CONTRACT_ADDRESS);

  console.log("\n🔎 Reading CIDs from contract...");
  const inputCid = await contract.inputCid();
  const outputCid = await contract.outputCid();

  console.log("inputCid:", inputCid || "(empty)");
  console.log("outputCid:", outputCid || "(empty)");

  if (!inputCid || !outputCid) {
    throw new Error(
      "One or both CIDs are empty on-chain. Run Lesson 2b (setInputCid) and Lesson 3c (setOutputCid)."
    );
  }

  // Download from storage
  const indexer = new Indexer(INDEXER_RPC);

  const tmpDir = path.resolve(__dirname, "..", "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const inputPath = path.join(tmpDir, `input-${inputCid.slice(0, 10)}.txt`);
  const outputPath = path.join(tmpDir, `output-${outputCid.slice(0, 10)}.json`);

  console.log("\n⬇️ Downloading input from storage...");
  const inputText = await downloadText(indexer, inputCid, inputPath);

  console.log("⬇️ Downloading output from storage...");
  const outputText = await downloadText(indexer, outputCid, outputPath);

  // Save a small “lesson artifact” summary
  const artifactsDir = path.resolve(__dirname, "..", "artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const artifactPath = path.join(artifactsDir, "pipelineRead.json");
  fs.writeFileSync(
    artifactPath,
    JSON.stringify(
      {
        contract: CONTRACT_ADDRESS,
        inputCid,
        outputCid,
        downloaded: {
          inputPath,
          outputPath
        },
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );

  // Print nicely
  console.log("\n==============================");
  console.log("✅ Pipeline Read Complete");
  console.log("==============================");

  console.log("\n--- Input (first 1200 chars) ---\n");
  console.log(inputText.slice(0, 1200));
  if (inputText.length > 1200) console.log("\n...(truncated)");

  prettyPrintOutput(outputText);

  console.log("\nSaved read artifact:", artifactPath);
  console.log("Saved downloaded files:", inputPath, "and", outputPath);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
