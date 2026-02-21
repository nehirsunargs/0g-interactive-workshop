"use client";

import Link from "next/link";
import { type NodeId } from "@/lib/nodes";
import {
  LayoutDashboard,
  Link2,
  Database,
  Cpu,
  Search,
  Droplet,
  ArrowRight
} from "lucide-react";

const ICONS: Record<NodeId, React.ElementType> = {
  frontend: LayoutDashboard,
  chain: Link2,
  storage: Database,
  compute: Cpu,
  explorer: Search,
  faucet: Droplet,
};

type NodeCardProps = {
  id: NodeId;
  title: string;
  description: string;
  useCases: string[];
  index: number;
};

export function NodeCard({ id, title, description, useCases, index }: NodeCardProps) {
  const Icon = ICONS[id];
  const num = String(index + 1).padStart(2, "0");

  const externalUrls: Partial<Record<NodeId, string>> = {
    explorer: "https://chainscan-galileo.0g.ai",
    faucet: "https://faucet.0g.ai",
  };

  return (
    <Link
      href={externalUrls[id] || `/node/${id}`}
      target={externalUrls[id] ? "_blank" : undefined}
      rel={externalUrls[id] ? "noopener noreferrer" : undefined}
      className="group relative block w-full perspective-1000"
    >
      {/* 1. Outer Glow (Hover Only) */}
      <div className="absolute -inset-1 rounded-[2.2rem] bg-primary/20 opacity-0 blur-xl transition duration-500 group-hover:opacity-40" />

      {/* 2. Main Card Container (The Border Layer) */}
      <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c16] p-1 transition-all duration-300 hover:border-primary/50 hover:translate-y-[-4px]">
        
        {/* 3. Inner Content (The Dark Gradient) */}
        <div className="relative h-full overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-[#131322] to-[#0a0a14] p-8 md:p-10">
          
          {/* Top-right Purple Blob (Ambient Glow) */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          {/* Watermark Number (The "01" Badge) */}
          <div className="absolute right-8 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/5 font-mono text-sm text-primary/60">
            {num}
          </div>

          <div className="flex flex-col gap-6">
            {/* Header: Icon + Title */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Icon Box */}
                <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1a2e] border border-white/10 text-primary shadow-[0_0_15px_-3px_rgba(183,95,255,0.4)] transition-transform duration-500 group-hover:scale-110">
                        <Icon size={32} strokeWidth={1.5} />
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                  {title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-[15px]">
                {description}
            </p>

            {/* Divider */}
            <div className="h-px w-full bg-white/5" />

            {/* Use Cases (Bullet points) */}
            <ul className="space-y-3">
              {useCases.map((uc, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  {/* Glowing Dot */}
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(183,95,255,1)]" />
                  {uc}
                </li>
              ))}
            </ul>

            {/* "Explore" Link at bottom (Optional but nice for UX) */}
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Explore Layer <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}