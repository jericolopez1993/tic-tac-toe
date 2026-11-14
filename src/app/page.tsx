import TicTacToe from "@/components/TicTacToe";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="stars" aria-hidden />
      <header className="text-center">
        <h1 className="title text-5xl font-black tracking-tight sm:text-6xl">Tic·Tac·Toe</h1>
        <p className="mt-2 text-sm opacity-70">Two players, one board. Three in a row wins.</p>
      </header>
      <TicTacToe />
      <footer className="text-xs opacity-50">Built with Next.js, React &amp; Tailwind CSS</footer>
    </main>
  );
}
