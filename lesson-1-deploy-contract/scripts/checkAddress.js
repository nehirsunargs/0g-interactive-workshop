require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const rpcUrl = process.env.RPC_URL;
  const addr = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl) throw new Error("Missing RPC_URL");
  if (!addr) throw new Error("Missing CONTRACT_ADDRESS");

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const code = await provider.getCode(addr);
  console.log("Address:", addr);
  console.log("Has contract code?:", code && code !== "0x" ? "YES" : "NO");
  console.log("Code length:", code.length);
}

main().catch((e) => {
  console.error("❌", e.message || e);
  process.exit(1);
});
