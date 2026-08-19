export function AbstractIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Background grid */}
      <rect x="20" y="20" width="360" height="360" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="20" y1="80" x2="380" y2="80" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="20" y1="140" x2="380" y2="140" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="20" y1="260" x2="380" y2="260" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="20" y1="320" x2="380" y2="320" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="80" y1="20" x2="80" y2="380" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="140" y1="20" x2="140" y2="380" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="200" y1="20" x2="200" y2="380" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="260" y1="20" x2="260" y2="380" stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="320" y1="20" x2="320" y2="380" stroke="#e5e5e5" strokeWidth="0.5" />

      {/* Large primary block - top left */}
      <rect x="40" y="40" width="140" height="140" fill="oklch(0.488 0.243 264.376)" />
      <rect x="40" y="40" width="140" height="140" stroke="oklch(0.97 0.014 254.604)" strokeWidth="2" />
      <text x="110" y="115" textAnchor="middle" fill="oklch(0.97 0.014 254.604)" fontSize="14" fontFamily="monospace" fontWeight="600">BUN</text>

      {/* Gray block - top right */}
      <rect x="200" y="40" width="160" height="100" fill="oklch(0.97 0 0)" />
      <rect x="200" y="40" width="160" height="100" stroke="oklch(0.556 0 0)" strokeWidth="2" />
      <text x="280" y="95" textAnchor="middle" fill="oklch(0.556 0 0)" fontSize="14" fontFamily="monospace" fontWeight="600">VITE</text>

      {/* Dark block - middle */}
      <rect x="200" y="160" width="100" height="120" fill="oklch(0.145 0 0)" />
      <rect x="200" y="160" width="100" height="120" stroke="oklch(0.145 0 0)" strokeWidth="2" />
      <text x="250" y="225" textAnchor="middle" fill="oklch(0.985 0 0)" fontSize="14" fontFamily="monospace" fontWeight="600">HONO</text>

      {/* Secondary block - bottom left */}
      <rect x="40" y="200" width="140" height="80" fill="oklch(0.967 0.001 286.375)" />
      <rect x="40" y="200" width="140" height="80" stroke="oklch(0.21 0.006 285.885)" strokeWidth="2" />
      <text x="110" y="245" textAnchor="middle" fill="oklch(0.21 0.006 285.885)" fontSize="14" fontFamily="monospace" fontWeight="600">TURBO</text>

      {/* Small accent block - bottom right */}
      <rect x="320" y="300" width="60" height="60" fill="oklch(0.488 0.243 264.376)" fillOpacity="0.3" />
      <rect x="320" y="300" width="60" height="60" stroke="oklch(0.488 0.243 264.376)" strokeWidth="2" />

      {/* Connecting lines between blocks */}
      <line x1="180" y1="110" x2="200" y2="90" stroke="oklch(0.556 0 0)" strokeWidth="2" />
      <line x1="180" y1="240" x2="200" y2="220" stroke="oklch(0.556 0 0)" strokeWidth="2" />
      <line x1="300" y1="160" x2="300" y2="140" stroke="oklch(0.556 0 0)" strokeWidth="2" />
      <line x1="300" y1="280" x2="320" y2="300" stroke="oklch(0.556 0 0)" strokeWidth="2" />

      {/* Small decorative dots */}
      <circle cx="60" cy="340" r="6" fill="oklch(0.488 0.243 264.376)" />
      <circle cx="90" cy="360" r="4" fill="oklch(0.145 0 0)" />
      <circle cx="150" cy="350" r="5" fill="oklch(0.97 0 0)" />
    </svg>
  );
}
