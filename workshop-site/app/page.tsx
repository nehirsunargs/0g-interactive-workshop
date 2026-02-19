import { HeroSection } from "@/components/hero-section";
import { StatsBar } from "@/components/stats-bar";
import { StackMap } from "@/components/stack-map";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-primary font-bold text-xs">0G</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Learn 0G
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Website</a>
            <a href="https://docs.0g.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Docs</a>
            <a href="https://0g.ai/brandkit" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Brand Kit</a>
          </nav>
        </div>
      </header>

      <HeroSection />
      <StatsBar />
      <StackMap />
      <SiteFooter />
    </main>
  );
}