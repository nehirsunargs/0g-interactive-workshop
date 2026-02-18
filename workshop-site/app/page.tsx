// app/page.tsx
// 0G Interactive Map — Premium Brand Edition

import Link from "next/link";
import React from "react";
import { nodes, type NodeId } from "@/lib/nodes";

/* ===============================
   WORLD CONSTANTS
   =============================== */

const GRID_UNIT = 220;
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 2400;

const NODE_WIDTH = 420;
const NODE_HEIGHT = 210;
const BASE_ELEVATION_PX = 6; // reduced to prevent visual distortion

/* ===============================
   MAP DATA
   =============================== */

type LayoutItem = {
  id: NodeId;
  gx: number;
  gy: number;
  gz?: number;
};

const LAYOUT: LayoutItem[] = [
  { id: "frontend", gx: 3, gy: 1, gz: 1 },
  { id: "chain", gx: 3, gy: 3, gz: 2 },
  { id: "storage", gx: 2, gy: 5, gz: 1 },
  { id: "compute", gx: 4, gy: 5, gz: 1 },
  { id: "explorer", gx: 3, gy: 7, gz: 1 },
  { id: "faucet", gx: 3, gy: 9, gz: 1 },
];

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [4, 5],
];

/* ===============================
   USE CASES
   =============================== */

const USE_CASES: Record<NodeId, string[]> = {
  frontend: [
    "Build apps & dashboards",
    "Create wallets & interfaces",
    "Visualize AI on-chain",
  ],
  chain: [
    "Deploy smart contracts",
    "Issue tokens & NFTs",
    "Run AI-native logic",
  ],
  storage: [
    "Store AI datasets",
    "Host structured data",
    "Verify integrity",
  ],
  compute: [
    "Train AI models",
    "Run decentralized inference",
    "Pay per workload",
  ],
  explorer: [
    "Inspect transactions",
    "Debug contracts",
    "Monitor AI jobs",
  ],
  faucet: [
    "Get testnet tokens",
    "Fund dev wallets",
    "Prototype faster",
  ],
};

/* ===============================
   HELPERS
   =============================== */

const wx = (gx: number) => gx * GRID_UNIT;
const wy = (gy: number) => gy * GRID_UNIT;
const wz = (gz = 0) => gz * BASE_ELEVATION_PX;

export default function Home() {
  const world = LAYOUT.map((i) => ({
    ...i,
    x: wx(i.gx),
    y: wy(i.gy),
    z: wz(i.gz),
  }));

  const pathD = (a: any, b: any) => {
    const dy = b.y - a.y;
    return `M ${a.x} ${a.y}
            C ${a.x} ${a.y + dy * 0.35},
              ${b.x} ${b.y - dy * 0.35},
              ${b.x} ${b.y}`;
  };

  return (
    <main className="min-h-screen bg-[#04060D] text-white">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-[#04060D]/80 backdrop-blur-xl border-b border-white/5 py-16 text-center">
        <h1 className="text-6xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
            LEARN 0G
          </span>
        </h1>

        <p className="mt-6 text-lg text-white/55 max-w-xl mx-auto">
          Learn about 0G by interacting with each component of its AI stack.
        </p>
      </header>

      {/* ================= WORLD ================= */}
      <section className="relative py-28">
        <div style={{ perspective: 1000, perspectiveOrigin: "50% 25%" }}>
          <div
            className="relative mx-auto"
            style={{
              width: MAP_WIDTH,
              height: MAP_HEIGHT,
              transformStyle: "preserve-3d",
              transform: "rotateX(15deg)",
            }}
          >
            {/* Background Field */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: `
                  radial-gradient(circle at 20% 10%, rgba(0,255,255,0.04), transparent 45%),
                  radial-gradient(circle at 80% 90%, rgba(0,255,255,0.03), transparent 50%),
                  linear-gradient(180deg, #04060D, #0A1020)
                `,
              }}
            />

            {/* Connections */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            >
              {CONNECTIONS.map(([a, b], i) => (
                <g key={i}>
                  <path
                    d={pathD(world[a], world[b])}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="14"
                    fill="none"
                  />
                  <path
                    d={pathD(world[a], world[b])}
                    stroke="rgba(0,255,255,0.6)"
                    strokeWidth="3"
                    fill="none"
                  />
                </g>
              ))}
            </svg>

            {/* Nodes */}
            {world.map((i) => {
              const node = nodes[i.id];

              return (
                <Link
                  key={i.id}
                  href={`/${i.id}`}
                  className="absolute group"
                  style={{
                    left: i.x,
                    top: i.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                    transform: `translate(-50%, -50%) translateZ(${i.z}px)`,
                  }}
                >
                  {/* Shadow */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-[88%] -translate-x-1/2 w-[85%] h-[35%]"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0.6), transparent 70%)",
                    }}
                  />

                  {/* Card */}
                  <div
                    className="relative w-full h-full rounded-2xl px-8 py-7 flex flex-col justify-start transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                      backdropFilter: "blur(8px)",
                      boxShadow: `
                        inset 0 0 0 1px rgba(255,255,255,0.06),
                        0 10px 30px rgba(0,255,255,0.08)
                      `,
                    }}
                  >
                    {/* Title */}
                    <div className="text-center text-lg font-semibold tracking-[0.25em] text-cyan-300">
                      {node.title.toUpperCase()}
                    </div>

                    {/* Divider (now muted, NOT same color) */}
                    <div className="mx-auto mt-4 mb-5 h-px w-16 bg-slate-600/60" />

                    {/* Use cases */}
                    <ul className="space-y-2 text-sm text-white/70 leading-relaxed">
                      {USE_CASES[i.id].map((uc) => (
                        <li key={uc}>• {uc}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
