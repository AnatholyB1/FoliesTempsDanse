import Link from "next/link";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-auto border-t border-border bg-card text-card-foreground"
      role="contentinfo"
    >
      {/* Main footer content */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-2">
          <span
            className="text-lg font-bold text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            les Folies Temps&apos;Danse
          </span>
          <span
            className="mt-1 block h-px w-10 rounded-full"
            style={{ background: "var(--gold)" }}
            aria-hidden
          />
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Application de gestion des costumes, accessoires et spectacles
            de la troupe de danse.
          </p>
        </div>

        {/* Col 2 — Liens légaux */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Informations légales
          </p>
          <nav aria-label="Liens légaux" className="flex flex-col gap-1.5 mt-1">
            <Link
              href="/mentions-legales"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/condition-d-utilisation"
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
          </nav>
        </div>

        {/* Col 3 — Crédits */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Réalisé par
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            <a
              href="https://www.selenium-studio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span
                className="inline-block w-1 h-1 rounded-full"
                style={{ background: "var(--gold)" }}
                aria-hidden
              />
              Selenium Studio
            </a>
            <a
              href="https://www.anatholy-bricon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <span
                className="inline-block w-1 h-1 rounded-full"
                style={{ background: "var(--gold)" }}
                aria-hidden
              />
              Anatholy Bricon
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t border-border px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTopColor: "color-mix(in srgb, var(--gold) 30%, transparent)" }}
      >
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          © {year} les Folies Temps&apos;Danse — Tous droits réservés.
        </p>
        <p className="text-xs text-muted-foreground text-center sm:text-right">
          Créé par{" "}
          <a
            href="https://www.selenium-studio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline underline-offset-2"
          >
            selenium-studio.com
          </a>
          {" & "}
          <a
            href="https://www.anatholy-bricon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline underline-offset-2"
          >
            anatholy-bricon.com
          </a>
        </p>
      </div>
    </footer>
  );
}
