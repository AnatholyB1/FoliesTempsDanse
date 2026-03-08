import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p
        className="text-8xl font-bold select-none"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--primary)", opacity: 0.12 }}
        aria-hidden
      >
        403
      </p>
      <h1
        className="-mt-6 text-3xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Accès refusé
      </h1>

      <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
        <span className="h-px w-12 rounded-full" style={{ background: "var(--gold)" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
        <span className="h-px w-12 rounded-full" style={{ background: "var(--gold)" }} />
      </div>

      <p className="text-muted-foreground max-w-sm text-sm">
        Vous n&apos;avez pas la permission d&apos;accéder à cette page.
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