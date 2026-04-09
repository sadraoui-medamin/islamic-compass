const DecorativeBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top-right geometric pattern */}
      <svg
        className="absolute -top-20 -right-20 w-80 h-80 opacity-[0.04]"
        viewBox="0 0 200 200"
      >
        <pattern id="islamic-star" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z"
            fill="currentColor"
            className="text-primary"
          />
        </pattern>
        <rect width="200" height="200" fill="url(#islamic-star)" />
      </svg>

      {/* Bottom-left geometric pattern */}
      <svg
        className="absolute -bottom-16 -left-16 w-72 h-72 opacity-[0.03]"
        viewBox="0 0 200 200"
      >
        <pattern id="islamic-hex" x="0" y="0" width="50" height="44" patternUnits="userSpaceOnUse">
          <polygon
            points="25,0 50,14 50,38 25,50 0,38 0,14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary"
          />
        </pattern>
        <rect width="200" height="200" fill="url(#islamic-hex)" />
      </svg>

      {/* Floating gradient orbs */}
      <div
        className="absolute top-1/4 -right-12 w-48 h-48 rounded-full blur-3xl opacity-[0.06]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }}
      />
      <div
        className="absolute top-2/3 -left-16 w-56 h-56 rounded-full blur-3xl opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent)" }}
      />
      <div
        className="absolute top-[10%] left-1/3 w-32 h-32 rounded-full blur-3xl opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }}
      />

      {/* Subtle diagonal lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
        <pattern id="diag-lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#diag-lines)" />
      </svg>
    </div>
  );
};

export default DecorativeBackground;
