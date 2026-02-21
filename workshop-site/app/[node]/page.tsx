import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { nodes, type NodeId } from "@/lib/nodes";

function isNodeId(x: string): x is NodeId {
  return x === "chain" || x === "storage" || x === "compute" || x === "frontend" || x === "explorer" || x === "faucet";
}

export default async function NodePage({ params }: { params: Promise<{ node: string }> }) {
  const { node } = await params;
  if (!isNodeId(node)) return notFound();
  const data = nodes[node];

  if (data.externalUrl) {
    redirect(data.externalUrl);
  }

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-slate-600 hover:underline">← Back to map</Link>
        <h1 className="mt-4 text-3xl font-bold">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.oneLiner}</p>
        {data.runCommand && (
          <section className="mt-6 rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Run this step</h2>
            <pre className="mt-3 rounded-xl bg-slate-900 text-slate-100 p-4 overflow-x-auto">{data.runCommand}</pre>
          </section>
        )}
        {data.lessonFolder && (
          <section className="mt-6 rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">Lesson folder</h2>
            <code className="bg-slate-100 px-2 py-1 rounded">{data.lessonFolder}/</code>
          </section>
        )}
        <section className="mt-6 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">What you'll build</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            {data.whatYouBuild.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </section>
        <section className="mt-6 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">Common issues</h2>
          <div className="mt-3 space-y-3">
            {data.commonIssues.map((i) => (
              <div key={i.problem} className="rounded-xl bg-slate-50 p-4">
                <div className="font-medium">Problem: {i.problem}</div>
                <div className="text-slate-700">Fix: {i.fix}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}