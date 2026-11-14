import type { Player } from "@/lib/game";

/** Hand-drawn style animated marks: a comet streak for X, a planet ring for O. */
export function Mark({ player, className = "" }: { player: Player; className?: string }) {
  if (player === "X") {
    return (
      <svg viewBox="0 0 100 100" className={`mark mark-x ${className}`} aria-hidden="true">
        <path d="M22 22 L78 78" />
        <path d="M78 22 L22 78" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={`mark mark-o ${className}`} aria-hidden="true">
      <circle cx="50" cy="50" r="29" />
    </svg>
  );
}
