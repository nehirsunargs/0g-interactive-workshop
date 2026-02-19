"use client";

/**
 * Vertical animated connection lines between the stack layers.
 * Renders between each row of the grid using a vertical SVG line with animated dashes.
 */
export function ConnectionLine() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg width="2" height="48" viewBox="0 0 2 48" fill="none">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="48"
          stroke="url(#line-grad)"
          strokeWidth="2"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-16"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </line>
        <defs>
          <linearGradient id="line-grad" x1="1" y1="0" x2="1" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B75FFF" stopOpacity="0.6" />
            <stop offset="1" stopColor="#9200E1" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/** Forked connection (1 -> 2 split) */
export function ConnectionFork() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg width="300" height="48" viewBox="0 0 300 48" fill="none">
        {/* Center down */}
        <line x1="150" y1="0" x2="150" y2="16" stroke="rgba(183,95,255,0.4)" strokeWidth="2" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </line>
        {/* Left branch */}
        <path d="M150 16 Q150 32, 75 48" stroke="rgba(183,95,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Right branch */}
        <path d="M150 16 Q150 32, 225 48" stroke="rgba(183,95,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

/** Merge connection (2 -> 1) */
export function ConnectionMerge() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg width="300" height="48" viewBox="0 0 300 48" fill="none">
        {/* Left merge */}
        <path d="M75 0 Q75 16, 150 32" stroke="rgba(183,95,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Right merge */}
        <path d="M225 0 Q225 16, 150 32" stroke="rgba(183,95,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Center down */}
        <line x1="150" y1="32" x2="150" y2="48" stroke="rgba(183,95,255,0.4)" strokeWidth="2" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
}
