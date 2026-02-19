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
function getEnv(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

const hr = (title = "") => {
  const line = "─".repeat(42);
  if (!title) return console.log(line);
  console.log(`${line}\n${title}\n${line}`);
};

function truncate(s, n) {
  if (!s) return "";
  return s.length <= n ? s : s.slice(0, n) + "…";
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function downloadText(indexer, cid, outPath) {
  const err = await indexer.download(cid, outPath, true);
  if (err) throw new Error(`Download failed for ${cid}: ${err}`);
  return fs.readFileSync(outPath, "utf-8");
}

async function fetchAndPrintEvents({
  provider,
  contractAddress,
  inputCidNow,
  outputCidNow,
  blocksBack
}) {
  hr(`🧾 Event verification (last ~${blocksBack} blocks)`);

  const iface = new ethers.Interface([
    "event InputCidSet(string cid)",
    "event OutputCidSet(string cid)"
  ]);

  const currentBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, currentBlock - blocksBack);

  const inputTopic = iface.getEvent("InputCidSet").topicHash;
  const outputTopic = iface.getEvent("OutputCidSet").topicHash;

  const [inputLogs, outputLogs] = await Promise.all([
    provider.getLogs({
      address: contractAddress,
      fromBlock,
      toBlock: currentBlock,
      topics: [inputTopic]
    }),
    provider.getLogs({
      address: contractAddress,
      fromBlock,
      toBlock: currentBlock,
      topics: [outputTopic]
    })
  ]);

  const parseLogs = (logs, eventName) =>
    logs
      .map((log) => {
        try {
          const parsed = iface.parseLog(log);
          return {
            event: eventName,
            cid: parsed.args.cid,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.blockNumber - a.blockNumber);

  const inputEvents = parseLogs(inputLogs, "InputCidSet");
  const outputEvents = parseLogs(outputLogs, "OutputCidSet");

  const lastInput = inputEvents[0];
  const lastOutput = outputEvents[0];

  console.log(`Found InputCidSet events: ${inputEvents.length}`);
  console.log(`Found OutputCidSet events: ${outputEvents.length}\n`);

  if (lastInput) {
    console.log("Most recent InputCidSet:");
    console.log("  block:", lastInput.blockNumber);
    console.log("  cid:  ", lastInput.cid);
    console.log("  tx:   ", lastInput.txHash);
    console.log(
      "  matches current inputCid():",
      lastInput.cid === inputCidNow ? "✅ yes" : "⚠️ no"
    );
    console.log();
  } else {
    console.log("No InputCidSet events found in this block range.\n");
  }

  if (lastOutput) {
    console.log("Most recent OutputCidSet:");
    console.log("  block:", lastOutput.blockNumber);
    console.log("  cid:  ", lastOutput.cid);
    console.log("  tx:   ", lastOutput.txHash);
    console.log(
      "  matches current outputCid():",
      lastOutput.cid === outputCidNow ? "✅ yes" : "⚠️ no"
    );
    console.log();
  } else {
    console.log("No OutputCidSet events found in this block range.\n");
  }

  console.log(
    "Tip: If you see 0 events, increase EVENT_BLOCKS_BACK in .env (e.g., 20000)."
  );
}

async function main() {
  const RPC_URL = requireEnv("RPC_URL");
  const INDEXER_RPC = requireEnv("INDEXER_RPC");
  const CONTRACT_ADDRESS = requireEnv("CONTRACT_ADDRESS");

  // Optional: set to 1 to verify events
  const VERIFY_EVENTS = getEnv("VERIFY_EVENTS", "0") === "1";
  const EVENT_BLOCKS_BACK = Number(getEnv("EVENT_BLOCKS_BACK", "5000"));

  // Provider-only for reads
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Reads only
  const abi = [
    "function inputCid() view returns (string)",
    "function outputCid() view returns (string)"
  ];
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  hr("🔗 Lesson 4: Read end-to-end (pretty)");
  console.log("RPC_URL:       ", RPC_URL);
  console.log("INDEXER_RPC:   ", INDEXER_RPC);
  console.log("CONTRACT:      ", CONTRACT_ADDRESS);
  console.log("VERIFY_EVENTS: ", VERIFY_EVENTS ? "on" : "off");
  if (VERIFY_EVENTS) console.log("EVENT_BLOCKS_BACK:", EVENT_BLOCKS_BACK);

  hr("🔎 Read CIDs from contract");
  const [inputCid, outputCid] = await Promise.all([
    contract.inputCid(),
    contract.outputCid()
  ]);

  console.log("inputCid(): ", inputCid || "(empty)");
  console.log("outputCid():", outputCid || "(empty)");

  if (!inputCid || !outputCid) {
    throw new Error(
      "One or both CIDs are empty on-chain. Run Lesson 2b set:input and Lesson 3c set:output."
    );
  }

  if (VERIFY_EVENTS) {
    await fetchAndPrintEvents({
      provider,
      contractAddress: CONTRACT_ADDRESS,
      inputCidNow: inputCid,
      outputCidNow: outputCid,
      blocksBack: EVENT_BLOCKS_BACK
    });
  }

  hr("⬇️ Download from 0G Storage");
  const indexer = new Indexer(INDEXER_RPC);

  const tmpDir = path.resolve(__dirname, "..", "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const inputPath = path.join(tmpDir, `input-${inputCid.slice(0, 10)}.txt`);
  const outputPath = path.join(tmpDir, `output-${outputCid.slice(0, 10)}.json`);

  console.log("Downloading input ->", inputPath);
  const inputText = await downloadText(indexer, inputCid, inputPath);

  console.log("Downloading output ->", outputPath);
  const outputText = await downloadText(indexer, outputCid, outputPath);

  hr("📝 Input");
  console.log(truncate(inputText, 1400));
  if (inputText.length > 1400) console.log("\n(truncated)");

  hr("🧠 Output");
  const parsed = safeJsonParse(outputText);
  if (!parsed) {
    console.log(truncate(outputText, 5000));
    if (outputText.length > 5000) console.log("\n(truncated)");
  } else {
    console.log("Summary:\n", parsed.summary ? parsed.summary : "(missing)", "\n");

    if (Array.isArray(parsed.bullets) && parsed.bullets.length) {
      console.log("Bullets:");
      for (const b of parsed.bullets) console.log(" •", b);
      console.log();
    } else {
      console.log("Bullets: (missing)\n");
    }

    if (parsed.mode) console.log("Mode:", parsed.mode);
    if (parsed.timestamp) console.log("Timestamp:", parsed.timestamp);
  }

  hr("💾 Saved");
  const artifactsDir = path.resolve(__dirname, "..", "artifacts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const artifactPath = path.join(artifactsDir, "pipelineRead.pretty.json");
  fs.writeFileSync(
    artifactPath,
    JSON.stringify(
      {
        contract: CONTRACT_ADDRESS,
        inputCid,
        outputCid,
        downloaded: { inputPath, outputPath },
        verifyEvents: VERIFY_EVENTS,
        eventBlocksBack: VERIFY_EVENTS ? EVENT_BLOCKS_BACK : null,
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );

  console.log("Artifact:", artifactPath);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
