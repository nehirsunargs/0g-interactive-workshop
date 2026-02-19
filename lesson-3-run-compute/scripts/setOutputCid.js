import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  const PRIVATE_KEY = requireEnv("PRIVATE_KEY");
  const CONTRACT_ADDRESS = requireEnv("CONTRACT_ADDRESS");

  // Load output CID artifact from Lesson 3 upload
  const artifactPath = path.resolve(__dirname, "..", "artifacts", "outputCid.json");

  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      "Missing artifacts/outputCid.json. Run `npm run upload:result` (or `npm run demo`) first."
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const outputCid = artifact.outputRootHash;

  if (!outputCid) throw new Error("outputCid.json missing outputRootHash");

  console.log("Using output CID:", outputCid);

  // Provider + signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Signer:", await signer.getAddress());
  console.log("Contract:", CONTRACT_ADDRESS);

  // Minimal ABI
  const abi = [
    "function setOutputCid(string calldata cid) external",
    "function outputCid() view returns (string)"
  ];

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  console.log("\n⛓ Sending transaction...");
  const tx = await contract.setOutputCid(outputCid);
  console.log("Tx sent:", tx.hash);

  await tx.wait();

  console.log("✅ Transaction confirmed");

  // Verify
  const stored = await contract.outputCid();
  console.log("Stored outputCid:", stored);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
