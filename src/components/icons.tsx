export function HelloFounderLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 250 50"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="url(#grad1)"
      >
        HELLO FOUNDER
      </text>
    </svg>
  );
}
