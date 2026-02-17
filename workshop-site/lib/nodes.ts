export type NodeId = "chain" | "storage" | "compute" | "frontend" | "explorer" | "faucet";

export const nodes: Record<
  NodeId,
  {
    title: string;
    oneLiner: string;
    lessonFolder?: string;
    runCommand?: string;
    whatYouBuild: string[];
    commonIssues: { problem: string; fix: string }[];
  }
> = {
  chain: {
    title: "Chain (Smart Contracts)",
    oneLiner: "Deploy a contract that stores CIDs (pointers) to storage + compute outputs.",
    lessonFolder: "lesson-1-deploy-contract",
    runCommand: "npm run lesson:contract",
    whatYouBuild: [
      "Deploy a Registry contract",
      "Write storageCid + resultCid",
      "Read them back from the chain",
    ],
    commonIssues: [
      { problem: "insufficient funds for gas", fix: "Use faucet, confirm correct network + wallet." },
      { problem: "wrong chainId / RPC", fix: "Double-check RPC_URL + chain ID in Hardhat config." },
    ],
  },
  storage: {
    title: "Storage",
    oneLiner: "Upload large data off-chain and get a CID you can reference on-chain.",
    lessonFolder: "lesson-2-upload-storage",
    runCommand: "npm run lesson:storage",
    whatYouBuild: ["Upload input.txt to 0G Storage", "Get CID", "Optionally write CID to contract"],
    commonIssues: [
      { problem: "upload timeout", fix: "Retry; check endpoint; try smaller file." },
      { problem: "auth / env missing", fix: "Make sure .env is set and loaded." },
    ],
  },
  compute: {
    title: "Compute",
    oneLiner: "Run heavy jobs (like summarization) off-chain, then store results back to storage.",
    lessonFolder: "lesson-3-run-compute",
    runCommand: "npm run lesson:compute",
    whatYouBuild: ["Trigger compute job", "Poll status/logs", "Save output to storage + chain"],
    commonIssues: [
      { problem: "job stuck pending", fix: "Check network health; confirm job parameters; retry." },
      { problem: "job failed", fix: "Read logs; reduce input size; verify config." },
    ],
  },
  frontend: {
    title: "Frontend",
    oneLiner: "A simple UI that reads CIDs from the contract and fetches data from storage.",
    lessonFolder: "lesson-5-frontend",
    runCommand: "npm run lesson:frontend",
    whatYouBuild: ["Fetch contract state", "Fetch storage content by CID", "Display nicely in UI"],
    commonIssues: [
      { problem: "CORS / fetch errors", fix: "Use correct gateway URL; check CID format." },
      { problem: "contract reads fail", fix: "Confirm RPC + contract address." },
    ],
  },
  explorer: {
    title: "Explorer",
    oneLiner: "Verify transactions, contracts, and job-related activity using the 0G explorer.",
    whatYouBuild: ["Find your deploy tx", "Confirm contract address", "Share proof of activity"],
    commonIssues: [{ problem: "can’t find tx", fix: "Confirm you’re on the right network (testnet vs mainnet)." }],
  },
  faucet: {
    title: "Faucet",
    oneLiner: "Get testnet tokens so you can pay gas for deployments and transactions.",
    whatYouBuild: ["Request testnet tokens", "Verify wallet balance"],
    commonIssues: [{ problem: "request fails", fix: "Try again later; check rate limits; use a different wallet." }],
  },
};
