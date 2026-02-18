import Link from "next/link";
import { nodes, type NodeId } from "@/lib/nodes";

const layout: { id: NodeId; col: string }[] = [
  { id: "frontend", col: "col-span-2" },
  { id: "chain", col: "col-span-1" },
  { id: "storage", col: "col-span-1" },
  { id: "compute", col: "col-span-2" },
  { id: "explorer", col: "col-span-1" },
  { id: "faucet", col: "col-span-1" },
];

export default function Home() {
  return (
    <main className="min-h-screen p-10 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">0G Interactive Map</h1>
        <p className="mt-2 text-white">
          Click a component to learn it, run a real example, and troubleshoot common issues.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {layout.map(({ id, col }) => (
            <Link
              key={id}
              href={`/${id}`}
              className={`rounded-2xl border border-white p-5 hover:shadow-sm transition ${col}`}
            >
              <div className="text-xl font-semibold text-white">{nodes[id].title}</div>
              <div className="mt-2 text-white">{nodes[id].oneLiner}</div>
              <div className="mt-3 text-sm text-white">
                Click to open →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}