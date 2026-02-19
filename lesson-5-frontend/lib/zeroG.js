import { ethers } from "ethers";

const PIPELINE_ABI = [
  "function inputCid() view returns (string)",
  "function outputCid() view returns (string)",
];

export function getConfig() {
  const cfg = {
    rpcUrl: import.meta.env.VITE_RPC_URL,
    indexerHttp: import.meta.env.VITE_INDEXER_HTTP,
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    explorerBase: import.meta.env.VITE_EXPLORER_BASE || "https://chainscan-galileo.0g.ai",
  };

  for (const [k, v] of Object.entries(cfg)) {
    if (!v) throw new Error(`Missing env var for ${k}. Check your .env`);
  }
  return cfg;
}

export async function readCids() {
  const { rpcUrl, contractAddress } = getConfig();
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, PIPELINE_ABI, provider);

  const [inputCid, outputCid] = await Promise.all([
    contract.inputCid(),
    contract.outputCid(),
  ]);

  return { inputCid, outputCid };
}

/**
 * Download file content via Indexer HTTP gateway:
 * GET /file?root=<rootHash>
 * (documented in 0g-storage-client README)
 */
export async function fetchFromStorage(rootHash) {
  const { indexerHttp } = getConfig();
  const url = `${indexerHttp.replace(/\/$/, "")}/file?root=${encodeURIComponent(rootHash)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Storage fetch failed (${res.status}) for root=${rootHash}`);
  }

  // Try JSON first; otherwise return text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function explorerTx(txHash) {
  const { explorerBase } = getConfig();
  return `${explorerBase.replace(/\/$/, "")}/tx/${txHash}`;
}

export function explorerAddress(addr) {
  const { explorerBase } = getConfig();
  return `${explorerBase.replace(/\/$/, "")}/address/${addr}`;
}
