"use client";

import { useEffect, useMemo, useState } from "react";
import { Mark } from "@/components/Mark";
import { emptyBoard, getOutcome, type Board, type Player } from "@/lib/game";

type Score = { X: number; O: number; draws: number };
const ZERO: Score = { X: 0, O: 0, draws: 0 };
const STORAGE_KEY = "ttt-score-v1";

const PLAYER_NAME: Record<Player, string> = { X: "Player X", O: "Player O" };

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [starter, setStarter] = useState<Player>("X");
  const [score, setScore] = useState<Score>(ZERO);
  const [recorded, setRecorded] = useState(false);

  const outcome = useMemo(() => getOutcome(board, starter), [board, starter]);

  // Restore scoreboard from a previous visit.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setScore({ ...ZERO, ...JSON.parse(saved) });
    } catch {
      /* storage unavailable — scores just won't persist */
    }
  }, []);

  // Record the result exactly once per finished game.
  useEffect(() => {
    if (recorded || outcome.status === "playing") return;
    setRecorded(true);
    setScore((s) => {
      const next =
        outcome.status === "won"
          ? { ...s, [outcome.winner]: s[outcome.winner] + 1 }
          : { ...s, draws: s.draws + 1 };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [outcome, recorded]);

  function play(i: number) {
    if (outcome.status !== "playing" || board[i]) return;
    const next = board.slice();
    next[i] = outcome.next;
    setBoard(next);
  }

  function newGame() {
    // Loser (or the player who went second on a draw) starts the next round.
    setStarter((s) =>
      outcome.status === "won" ? (outcome.winner === "X" ? "O" : "X") : s === "X" ? "O" : "X",
    );
    setBoard(emptyBoard());
    setRecorded(false);
  }

  function resetScores() {
    setScore(ZERO);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const winLine = outcome.status === "won" ? outcome.line : null;
  const active = outcome.status === "playing" ? outcome.next : null;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      {/* Scoreboard */}
      <section aria-label="Scoreboard" className="grid w-full grid-cols-3 gap-3">
        <ScoreCard label={PLAYER_NAME.X} value={score.X} player="X" active={active === "X"} />
        <ScoreCard label="Draws" value={score.draws} />
        <ScoreCard label={PLAYER_NAME.O} value={score.O} player="O" active={active === "O"} />
      </section>

      {/* Status */}
      <div
        role="status"
        aria-live="polite"
        data-testid="status"
        className="flex h-12 items-center justify-center gap-2 text-xl font-semibold tracking-wide"
      >
        {outcome.status === "playing" && (
          <>
            <Mark player={outcome.next} className="h-7 w-7" />
            <span>{PLAYER_NAME[outcome.next]}&apos;s turn</span>
          </>
        )}
        {outcome.status === "won" && (
          <span className="banner flex items-center gap-2">
            <span aria-hidden>🏆</span>
            <Mark player={outcome.winner} className="h-7 w-7" />
            <span>{PLAYER_NAME[outcome.winner]} wins!</span>
          </span>
        )}
        {outcome.status === "draw" && (
          <span className="banner">
            <span aria-hidden>🤝 </span>It&apos;s a draw!
          </span>
        )}
      </div>

      {/* Board */}
      <div
        role="grid"
        aria-label="Tic-Tac-Toe board"
        className="board grid aspect-square w-full grid-cols-3 grid-rows-3 gap-3 rounded-3xl p-3"
      >
        {board.map((cell, i) => {
          const isWin = winLine?.includes(i) ?? false;
          const disabled = !!cell || outcome.status !== "playing";
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              data-testid={`cell-${i}`}
              aria-label={`Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}${cell ? `: ${cell}` : ""}`}
              onClick={() => play(i)}
              disabled={disabled}
              className={`cell group relative flex items-center justify-center rounded-2xl ${
                isWin ? "cell-win" : ""
              } ${outcome.status === "won" && !isWin ? "opacity-40" : ""}`}
            >
              {cell ? (
                <Mark player={cell} className="h-3/4 w-3/4" />
              ) : (
                active && (
                  <Mark
                    player={active}
                    className="ghost h-3/4 w-3/4 opacity-0 transition-opacity group-hover:opacity-25"
                  />
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex w-full gap-3">
        <button type="button" onClick={newGame} className="btn-primary flex-1 rounded-xl px-5 py-3 text-lg font-bold">
          New Game
        </button>
        <button type="button" onClick={resetScores} className="btn-ghost rounded-xl px-4 py-3 text-sm font-semibold">
          Reset Scores
        </button>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  player,
  active = false,
}: {
  label: string;
  value: number;
  player?: Player;
  active?: boolean;
}) {
  return (
    <div
      className={`score-card flex flex-col items-center gap-1 rounded-2xl px-2 py-3 ${
        player ? `score-${player.toLowerCase()}` : ""
      } ${active ? "score-active" : ""}`}
    >
      <div className="flex h-6 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-80">
        {player && <Mark player={player} className="h-4 w-4" />}
        {label}
      </div>
      <div className="text-3xl font-black tabular-nums" data-testid={`score-${player ?? "draws"}`}>
        {value}
      </div>
    </div>
  );
}
