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
};

export const nodes: Record<NodeId, Node> = {
  frontend: {
    id: "frontend",
    title: "Frontend / dApps",
    description:
      "Open, autonomous applications that harness onchain AI with full composability.",
    icon: "layout",
  },
  chain: {
    id: "chain",
    title: "0G Chain",
    description:
      "A modular AI-first blockchain with scalable execution and multi-consensus validation.",
    icon: "link",
  },
  storage: {
    id: "storage",
    title: "Storage",
    description:
      "Decentralized, AI-optimized storage with ultra-low costs and verifiable permanence.",
    icon: "database",
  },
  compute: {
    id: "compute",
    title: "Compute Network",
    description:
      "Trustless AI inference and compute, secured by decentralized infrastructure.",
    icon: "cpu",
  },
  explorer: {
    id: "explorer",
    title: "Explorer",
    description:
      "Inspect transactions, debug contracts, and monitor AI workloads on-chain.",
    icon: "search",
  },
  faucet: {
    id: "faucet",
    title: "Faucet",
    description:
      "Get testnet tokens to fund developer wallets and prototype faster.",
    icon: "droplet",
  },
};
