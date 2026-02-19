import { useEffect, useMemo, useState } from "react";
import {
  getConfig,
  readCids,
  fetchFromStorage,
  explorerAddress,
} from "./lib/zeroG";

function Box({ title, children }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
      background: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

export default function App() {
  const cfg = useMemo(() => {
    try { return getConfig(); } catch { return null; }
  }, []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [inputCid, setInputCid] = useState("");
  const [outputCid, setOutputCid] = useState("");

  const [inputText, setInputText] = useState("");
  const [outputObj, setOutputObj] = useState(null);

  async function loadAll() {
    setErr("");
    setLoading(true);

    try {
      const { inputCid, outputCid } = await readCids();
      setInputCid(inputCid);
      setOutputCid(outputCid);

      if (!inputCid || !outputCid) {
        throw new Error("CIDs are empty on-chain. Run Lesson 2b (setInputCid) + Lesson 3c (setOutputCid).");
      }

      const [input, output] = await Promise.all([
        fetchFromStorage(inputCid),
        fetchFromStorage(outputCid),
      ]);

      // input is usually plain text
      setInputText(typeof input === "string" ? input : JSON.stringify(input, null, 2));

      // output is usually JSON { summary, bullets, ... }
      if (typeof output === "string") {
        try {
          setOutputObj(JSON.parse(output));
        } catch {
          setOutputObj({ summary: output, bullets: [] });
        }
      } else {
        setOutputObj(output);
      }
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = outputObj?.summary || "";
  const bullets = Array.isArray(outputObj?.bullets) ? outputObj.bullets : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>0G Pipeline Dashboard</div>
            <div style={{ color: "#475569", marginTop: 4 }}>
              Reads CIDs from chain → fetches objects from 0G Storage
            </div>
          </div>
          <button
            onClick={loadAll}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Refresh
          </button>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={explorerAddress(cfg?.contractAddress || "")} target="_blank" rel="noreferrer"
             style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700 }}>
            Contract on Explorer
          </a>
          <span style={{ color: "#64748b" }}>|</span>
          <span style={{ color: "#0f172a" }}>
            RPC: <span style={{ color: "#64748b" }}>{cfg?.rpcUrl}</span>
          </span>
          <span style={{ color: "#64748b" }}>|</span>
          <span style={{ color: "#0f172a" }}>
            Indexer: <span style={{ color: "#64748b" }}>{cfg?.indexerHttp}</span>
          </span>
        </div>

        {err && (
          <div style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            fontWeight: 700
          }}>
            {err}
          </div>
        )}

        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Box title="On-chain pointers (CIDs)">
            <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12 }}>
              <div><b>inputCid</b>: {inputCid || "(empty)"}</div>
              <div style={{ marginTop: 6 }}><b>outputCid</b>: {outputCid || "(empty)"}</div>
            </div>
            <div style={{ marginTop: 10, color: "#64748b" }}>
              If these are empty, run Lesson 2b + Lesson 3c write scripts.
            </div>
          </Box>

          <Box title="Compute output (summary)">
            {loading ? (
              <div style={{ color: "#64748b" }}>Loading…</div>
            ) : (
              <>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{summary || "(no summary found)"}</div>
                {bullets.length > 0 && (
                  <>
                    <div style={{ marginTop: 12, fontWeight: 800 }}>Bullets</div>
                    <ul style={{ marginTop: 6 }}>
                      {bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>{b}</li>
                      ))}
                    </ul>
                  </>
                )}
                {outputObj?.mode && (
                  <div style={{ marginTop: 10, color: "#64748b" }}>
                    mode: <b>{outputObj.mode}</b>{outputObj.timestamp ? ` • ${outputObj.timestamp}` : ""}
                  </div>
                )}
              </>
            )}
          </Box>

          <div style={{ gridColumn: "1 / -1" }}>
            <Box title="Original input (from storage)">
              {loading ? (
                <div style={{ color: "#64748b" }}>Loading…</div>
              ) : (
                <pre style={{
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: 13,
                  lineHeight: 1.4
                }}>
                  {inputText || "(no input found)"}
                </pre>
              )}
            </Box>
          </div>
        </div>

        <div style={{ marginTop: 18, color: "#64748b" }}>
          Tip: if Storage fetch fails, confirm your Indexer endpoint supports <code>/file?root=...</code>. :contentReference[oaicite:4]{index=4}
        </div>
      </div>
    </div>
  );
}
