require("dotenv").config();
const { ethers } = require("ethers");

const ABI = [
  "function inputCid() view returns (string)",
  "function outputCid() view returns (string)"
];

async function main() {
  const rpcUrl = process.env.RPC_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl) throw new Error("Missing RPC_URL in .env");
  if (!contractAddress) throw new Error("Missing CONTRACT_ADDRESS in .env");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, ABI, provider);

  const input = await contract.inputCid();
  const output = await contract.outputCid();

  console.log("✅ Read PipelineRegistry");
  console.log("Contract:", contractAddress);
  console.log("inputCid :", input || "(empty)");
  console.log("outputCid:", output || "(empty)");
  console.log("Explorer (address):", `https://explorer.0g.ai/address/${contractAddress}`);
}

main().catch((err) => {
  console.error("❌ Read failed:", err.message || err);
  process.exit(1);
});
