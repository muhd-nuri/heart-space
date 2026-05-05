type Kind = "instagram" | "tiktok" | "youtube" | "linkedin"

// Inline SVG marks — lucide-react v1 dropped brand glyphs, so we ship our
// own minimal versions tuned for small sizes (16–22px) at currentColor.
const PATHS: Record<Kind, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      d="M14.5 3v9.2a3 3 0 1 1-3-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 10v7M7.5 7.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.5 17v-3.8c0-1.4 1-2.4 2.3-2.4s2.2 1 2.2 2.4V17M11.5 10v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),
}

export function SocialIcon({ kind, size = 18 }: { kind: Kind; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {PATHS[kind]}
    </svg>
  )
}
