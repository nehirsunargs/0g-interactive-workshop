export type NodeId =
  | "frontend"
  | "chain"
  | "storage"
  | "compute"
  | "explorer"
  | "faucet";

export type Node = {
  id: NodeId;
  title: string;
  description: string;
  icon: string;
  oneLiner: string;
  runCommand?: string;
  lessonFolder?: string;
  whatYouBuild: string[];
  commonIssues: { problem: string; fix: string }[];
  externalUrl?: string;
};

export const nodes: Record<NodeId, Node> = {
  chain: {
    id: "chain",
    title: "0G Chain",
    description: "A modular AI-first blockchain with scalable execution and multi-consensus validation.",
    icon: "link",
    oneLiner: "Deploy a smart contract that stores your pipeline's input and output CIDs on-chain.",
    runCommand: "cd lesson-1-deploy-contract && npm run demo:deploy",
    lessonFolder: "lesson-1-deploy-contract",
    whatYouBuild: [
      "A Solidity smart contract (PipelineRegistry) with inputCid and outputCid fields",
      "A deploy script using Hardhat and ethers.js",
      "A read script to verify your contract is live on the 0G testnet",
    ],
    commonIssues: [
      { problem: "TypeError: Cannot read properties of undefined (reading 'address')", fix: "Add PRIVATE_KEY to your .env file" },
      { problem: "Missing CONTRACT_ADDRESS in .env", fix: "Copy the deployed address printed after npm run demo:deploy into your .env" },
      { problem: "network does not support ENS", fix: "CONTRACT_ADDRESS must be a 0x hex address, not an ENS name" },
    ],
  },
  storage: {
    id: "storage",
    title: "Storage",
    description: "Decentralized, AI-optimized storage with ultra-low costs and verifiable permanence.",
    icon: "database",
    oneLiner: "Upload your input file to 0G decentralized storage and register the CID on-chain.",
    runCommand: "cd lesson-2-upload-storage && npm run demo && npm run set:input",
    lessonFolder: "lesson-2-upload-storage",
    whatYouBuild: [
      "An upload script that stores a file on 0G storage and retrieves its root hash (CID)",
      "A script that writes the input CID to your on-chain contract",
      "An artifacts/inputCid.json file used by later lessons",
    ],
    commonIssues: [
      { problem: "Upload hangs with no output", fix: "Your wallet likely has no testnet tokens — visit https://faucet.0g.ai to get some" },
      { problem: "execution reverted: require(false)", fix: "Insufficient balance to pay storage fee — get tokens from the faucet" },
      { problem: "Missing RPC_URL or INDEXER_RPC", fix: "Add both to your .env file in lesson-2-upload-storage" },
    ],
  },
  compute: {
    id: "compute",
    title: "Compute Network",
    description: "Trustless AI inference and compute, secured by decentralized infrastructure.",
    icon: "cpu",
    oneLiner: "Download your input, run a compute job to summarize it, and upload the result to storage.",
    runCommand: "cd lesson-3-run-compute && npm run compute && npm run upload:result && npm run set:output",
    lessonFolder: "lesson-3-run-compute",
    whatYouBuild: [
      "A compute script that downloads input from 0G storage and summarizes it",
      "An upload script that stores the compute result back to 0G storage",
      "A script that writes the output CID to your on-chain contract",
    ],
    commonIssues: [
      { problem: "Missing artifacts/inputCid.json", fix: "Complete lesson 2 first — this file is created by the upload step" },
      { problem: "Download error", fix: "Check your INDEXER_RPC URL is correct in .env" },
      { problem: "Upload fails with execution reverted", fix: "Get testnet tokens from https://faucet.0g.ai" },
    ],
  },
  frontend: {
    id: "frontend",
    title: "Frontend / dApps",
    description: "Open, autonomous applications that harness onchain AI with full composability.",
    icon: "layout",
    oneLiner: "Build a dashboard that reads CIDs from your contract and displays data from 0G storage.",
    runCommand: "cd lesson-4-frontend && npm install && npm run dev",
    lessonFolder: "lesson-4-frontend",
    whatYouBuild: [
      "A React + Vite frontend that connects to your deployed contract",
      "A live dashboard showing your input text and compute summary",
      "Integration with 0G storage via the Indexer HTTP gateway",
    ],
    commonIssues: [
      { problem: "CIDs are empty on-chain", fix: "Complete lessons 2 and 3 first to write CIDs to your contract" },
      { problem: "Storage fetch failed", fix: "Check your VITE_INDEXER_HTTP URL in .env" },
      { problem: "Missing env vars", fix: "Create a .env file with VITE_RPC_URL, VITE_INDEXER_HTTP, VITE_CONTRACT_ADDRESS" },
    ],
  },
  explorer: {
    id: "explorer",
    title: "Explorer",
    description: "Inspect transactions, debug contracts, and monitor AI workloads on-chain.",
    icon: "search",
    oneLiner: "Use the 0G explorer to inspect your deployed contract and transactions.",
    externalUrl: "https://chainscan-galileo.0g.ai",
    whatYouBuild: [
      "Familiarity with reading on-chain contract state",
      "Ability to verify your CIDs are stored correctly on-chain",
    ],
    commonIssues: [
      { problem: "Contract not showing up", fix: "Make sure you deployed to the correct network (chainId 16602)" },
      { problem: "Transaction pending forever", fix: "Check your RPC_URL is pointing to the 0G testnet" },
    ],
  },
  faucet: {
    id: "faucet",
    title: "Faucet",
    description: "Get testnet tokens to fund developer wallets and prototype faster.",
    icon: "droplet",
    oneLiner: "Get free testnet OG tokens to pay for storage and contract deployment.",
    externalUrl: "https://faucet.0g.ai",
    whatYouBuild: [
      "A funded testnet wallet ready to deploy contracts and upload to storage",
    ],
    commonIssues: [
      { problem: "Faucet not sending tokens", fix: "Make sure you paste your 0x wallet address, not a contract address" },
      { problem: "Still getting execution reverted after faucet", fix: "Wait a minute and check your balance on the explorer before retrying" },
    ],
  },
};