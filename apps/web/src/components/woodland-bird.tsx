/** A quiet, decorative visitor at the woodland section's edge. */
export function WoodlandBird() {
  return (
    <svg className="woodland-bird" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M5 59c18-3 34 1 53-2M47 58l6-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="m29 45 1 11 5 1m6-14-2 13 5 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="m21 37-16-9 8 19 13-2" fill="currentColor" />
      <path d="M17 35c3-10 12-15 23-11 9 3 12 9 8 16-4 8-13 11-22 8-7-2-11-7-9-13Z" fill="#748874" />
      <path d="M18 37c7-8 14-10 23-7-4 9-11 15-21 14Z" fill="currentColor" />
      <g className="woodland-bird-head">
        <path d="m52 22 9 4-10 3Z" fill="currentColor" />
        <path d="M35 26c-2-7 2-14 9-14 7-1 12 5 11 11-1 7-6 11-12 10Z" fill="currentColor" />
        <circle cx="49" cy="20" r="1.25" fill="#f5f8ef" />
      </g>
    </svg>
  );
}
