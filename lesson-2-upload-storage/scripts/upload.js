import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

async function main() {
  const RPC_URL = requireEnv("RPC_URL");
  const INDEXER_RPC = requireEnv("INDEXER_RPC");
  const PRIVATE_KEY = requireEnv("PRIVATE_KEY");

  // Optional CLI arg: path to file
  const filePath =
    process.argv[2] ??
    path.resolve(__dirname, "..", "data", "input.txt");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  // Provider + signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Uploader address:", await signer.getAddress());
  console.log("Uploading file:", filePath);
  console.log("RPC_URL:", RPC_URL);
  console.log("INDEXER_RPC:", INDEXER_RPC);

  // Indexer client
  const indexer = new Indexer(INDEXER_RPC);

  // Create file object + merkle tree (recommended in starter)
  const zgFile = await ZgFile.fromFilePath(filePath);
  const [tree, treeErr] = await zgFile.merkleTree();
  if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);
  if (!tree) throw new Error("Merkle tree creation returned empty result.");
  console.log("🌳 Merkle root:", tree.rootHash());
  
  // Upload (returns tx info including rootHash + txHash)
  console.log("📤 Starting upload to indexer...");
  const [tx, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer);
  console.log("📥 Upload returned");
  await zgFile.close();

  if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);
  if (!tx) throw new Error("Upload returned empty tx result.");

  const rootHash = tx.rootHash; // this is your CID-like identifier
  const txHash = tx.txHash;

  console.log("\n✅ Upload complete");
  console.log("rootHash (CID):", rootHash);
  console.log("txHash:", txHash);

  // Save artifact
  const outDir = path.resolve(__dirname, "..", "artifacts");
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "inputCid.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        filePath,
        rootHash,
        txHash,
        rpcUrl: RPC_URL,
        indexerRpc: INDEXER_RPC,
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
