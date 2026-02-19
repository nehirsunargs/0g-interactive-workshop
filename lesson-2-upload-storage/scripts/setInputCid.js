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

  // Load artifact from Lesson 2 upload
  const artifactPath = path.resolve(
    __dirname,
    "..",
    "artifacts",
    "inputCid.json"
  );

  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      "Missing artifacts/inputCid.json. Run `npm run demo` in lesson-2 first."
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const cid = artifact.rootHash;

  console.log("Using CID:", cid);

  // Provider + signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Signer:", await signer.getAddress());
  console.log("Contract:", CONTRACT_ADDRESS);

  // Minimal ABI (only what we need)
  const abi = [
    "function setInputCid(string calldata cid) external",
    "function inputCid() view returns (string)"
  ];

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  console.log("\n⛓ Sending transaction...");
  const tx = await contract.setInputCid(cid);
  console.log("Tx sent:", tx.hash);

  await tx.wait();

  console.log("✅ Transaction confirmed");

  // Optional: verify
  const stored = await contract.inputCid();
  console.log("Stored inputCid:", stored);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err?.message ?? err);
  process.exit(1);
});
