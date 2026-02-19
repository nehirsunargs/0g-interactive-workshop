"use client";

import { nodes, type NodeId } from "@/lib/nodes";
import { NodeCard } from "@/components/node-card";
import { useEffect, useRef, useState, useCallback } from "react";

const USE_CASES: Record<NodeId, string[]> = {
  frontend: ["Build apps & dashboards", "Create wallets & interfaces", "Visualize AI on-chain"],
  chain: ["Deploy smart contracts", "Issue tokens & NFTs", "Run AI-native logic"],
  storage: ["Store AI datasets", "Host structured data", "Verify integrity"],
  compute: ["Train AI models", "Run decentralized inference", "Pay per workload"],
  explorer: ["Inspect transactions", "Debug contracts", "Monitor AI jobs"],
  faucet: ["Get testnet tokens", "Fund dev wallets", "Prototype faster"],
};

type StackNode = { id: NodeId; side: "left" | "right" };

const STACK_ORDER: StackNode[] = [
  { id: "frontend", side: "left" },
  { id: "chain", side: "right" },
  { id: "storage", side: "left" },
  { id: "compute", side: "right" },
  { id: "explorer", side: "left" },
  { id: "faucet", side: "right" },
];

function SnakeConnector({
  fromRef, toRef, containerRef,
}: {
  fromRef: HTMLDivElement | null; toRef: HTMLDivElement | null; containerRef: HTMLDivElement | null;
}) {
  const [path, setPath] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0, top: 0 });
  const svgId = useRef(`grad-${Math.random().toString(36).slice(2, 8)}`);

  const computePath = useCallback(() => {
    if (!fromRef || !toRef || !containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const fromRect = fromRef.getBoundingClientRect();
    const toRect = toRef.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
    const startY = fromRect.bottom - containerRect.top;
    const endX = toRect.left + toRect.width / 2 - containerRect.left;
    const endY = toRect.top - containerRect.top;

    const midY = (startY + endY) / 2;
    const d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

    setPath(d);
    setDims({ w: containerRect.width, h: containerRect.height, top: 0 });
  }, [fromRef, toRef, containerRef]);

  useEffect(() => {
    computePath();
    window.addEventListener("resize", computePath);
    return () => window.removeEventListener("resize", computePath);
  }, [computePath]);

  if (!path) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none z-0" width={dims.w} height={dims.h} style={{ top: dims.top }}>
      <defs>
        <linearGradient id={svgId.current} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B75FFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9200E1" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d={path} stroke={`url(#${svgId.current})`} strokeWidth="3" fill="none" className="drop-shadow-[0_0_8px_rgba(183,95,255,0.4)]" />
      <path d={path} stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeDasharray="6 6">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function StackMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center mb-24">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">
          Architecture
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          The <span className="text-primary">0G</span> Stack
        </h2>
        <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto font-light">
          Follow the path through every layer of the modular AI operating system.
        </p>
      </div>

      <div ref={containerRef} className="relative z-10 mx-auto max-w-5xl px-6">
        {/* SVG connectors */}
        {mounted && STACK_ORDER.slice(0, -1).map((node, i) => (
          <SnakeConnector
            key={`conn-${i}`}
            fromRef={cardRefs.current[i]}
            toRef={cardRefs.current[i + 1]}
            containerRef={containerRef.current}
          />
        ))}

        {/* Snake path of cards */}
        <div className="relative flex flex-col gap-16 md:gap-24">
          {STACK_ORDER.map((node, i) => {
            // Tightened the width slightly so the horizontal cards look cleaner
            const alignClass = node.side === "left" ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0";

            return (
              <div
                key={node.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`w-full md:w-[48%] ${alignClass} relative z-10`}
              >
                <NodeCard
                  id={node.id}
                  title={nodes[node.id].title}
                  description={nodes[node.id].oneLiner}
                  useCases={USE_CASES[node.id]}
                  index={i}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}