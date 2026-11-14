export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type Outcome =
  | { status: "playing"; next: Player }
  | { status: "won"; winner: Player; line: [number, number, number] }
  | { status: "draw" };

export const emptyBoard = (): Board => Array(9).fill(null);

export function getOutcome(board: Board, startingPlayer: Player = "X"): Outcome {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { status: "won", winner: v, line };
    }
  }
  const filled = board.filter(Boolean).length;
  if (filled === 9) return { status: "draw" };
  const other: Player = startingPlayer === "X" ? "O" : "X";
  return { status: "playing", next: filled % 2 === 0 ? startingPlayer : other };
}
