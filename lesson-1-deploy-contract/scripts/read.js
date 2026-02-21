require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  "function inputCid() view returns (string)",
  "function outputCid() view returns (string)"
];

async function main() {
  if (!RPC_URL) {
    console.log("❌ Missing RPC_URL in .env");
    return;
  }

  if (!CONTRACT_ADDRESS) {
    console.log("❌ Missing CONTRACT_ADDRESS in .env");
    return;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const input = await contract.inputCid();
  const output = await contract.outputCid();

  console.log("✅ Connected to contract:", CONTRACT_ADDRESS);
  console.log("Input CID:", input || "(empty)");
  console.log("Output CID:", output || "(empty)");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});