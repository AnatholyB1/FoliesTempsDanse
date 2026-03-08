"use client";
import Link from "next/link";

export default function Error() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p
        className="text-8xl font-bold select-none"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--primary)", opacity: 0.12 }}
        aria-hidden
      >
        Oops
      </p>
      <h1
        className="-mt-6 text-3xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Une erreur est survenue
      </h1>

      <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
        <span className="h-px w-12 rounded-full" style={{ background: "var(--gold)" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
        <span className="h-px w-12 rounded-full" style={{ background: "var(--gold)" }} />
      </div>

      <p className="text-muted-foreground max-w-sm text-sm">
        Désolé pour le dérangement, veuillez réessayer plus tard.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 hover:border-primary hover:bg-primary/5 transition-all rounded px-4 py-2"
      >
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}