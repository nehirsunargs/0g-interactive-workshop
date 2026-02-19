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

  const artifactsDir = path.resolve(__dirname, "..", "artifacts");
  const computePath = path.join(artifactsDir, "computeOutput.json");

  if (!fs.existsSync(computePath)) {
    throw new Error("Missing artifacts/computeOutput.json. Run `npm run compute` first.");
  }

  // Write a clean output file (what you actually upload)
  const uploadDir = path.resolve(__dirname, "..", "tmp");
  fs.mkdirSync(uploadDir, { recursive: true });

  const uploadPath = path.join(uploadDir, "output.json");
  fs.copyFileSync(computePath, uploadPath);

  // Provider + signer (upload requires signing a tx)
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Uploader address:", await signer.getAddress());
  console.log("Uploading result file:", uploadPath);

  const indexer = new Indexer(INDEXER_RPC);

  const zgFile = await ZgFile.fromFilePath(uploadPath);
  const [tree, treeErr] = await zgFile.merkleTree();
  if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);
  if (!tree) throw new Error("Merkle tree creation returned empty result.");

  const [tx, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer);
  await zgFile.close();

  if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);
  if (!tx) throw new Error("Upload returned empty tx result.");

  const outputRootHash = tx.rootHash;
  const txHash = tx.txHash;

  console.log("\n✅ Upload complete");
  console.log("output rootHash (CID):", outputRootHash);
  console.log("txHash:", txHash);

  // Save artifact for Lesson 3c / Lesson 4
  const outCidPath = path.join(artifactsDir, "outputCid.json");
  fs.writeFileSync(
    outCidPath,
    JSON.stringify(
      {
        outputRootHash,
        txHash,
        uploadedFile: uploadPath,
        rpcUrl: RPC_URL,
        indexerRpc: INDEXER_RPC,
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );

  console.log("Saved:", outCidPath);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
