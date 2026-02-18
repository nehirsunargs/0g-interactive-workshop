const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const bal = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(bal), "OG");

  const Factory = await hre.ethers.getContractFactory("PipelineRegistry");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const txHash = contract.deploymentTransaction().hash;

  console.log("\n✅ Deployed PipelineRegistry");
  console.log("Contract address:", address);
  console.log("Deploy tx hash:", txHash);
  console.log("Explorer (tx):", `https://explorer.0g.ai/tx/${txHash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
