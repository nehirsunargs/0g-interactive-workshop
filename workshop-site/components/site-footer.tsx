export function SiteFooter() {
  return (
    <footer className="relative border-t border-border py-14">
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-primary font-bold text-sm">0G</span>
          </div>
          <span className="text-sm text-muted-foreground">
            The Largest AI L1
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <a
            href="https://0g.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Website
          </a>
          <a
            href="https://docs.0g.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Docs
          </a>
          <a
            href="https://discord.gg/0glabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Discord
          </a>
          <a
            href="https://x.com/0aboratory"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            X
          </a>
        </nav>
      </div>
    </footer>
  );
}
