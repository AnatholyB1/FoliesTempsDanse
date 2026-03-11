import React from "react";
import Link from "next/link";

const MentionsLegales: React.FC = () => (
  <main className="flex justify-center items-start min-h-screen bg-background text-foreground py-12 px-4">
    <article className="w-full max-w-3xl rounded-(--radius-lg) bg-card text-card-foreground shadow-lg p-8 space-y-10">
      <header className="border-b border-border pb-6">
        <h1
          className="text-3xl font-bold text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Mentions légales
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Conformément aux articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004
          pour la Confiance dans l&apos;Économie Numérique (LCEN)
        </p>
      </header>

      {/* 1. Éditeur */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">1. Éditeur de l&apos;application</h2>
        <div className="space-y-1 text-sm leading-relaxed">
          <p><span className="font-medium">Dénomination&nbsp;:</span> Association les Folies Temps&apos;Danse</p>
          <p><span className="font-medium">Forme juridique&nbsp;:</span> Association loi 1901</p>
          <p><span className="font-medium">Siège social&nbsp;:</span> France</p>
          <p><span className="font-medium">Site web&nbsp;:</span>{" "}
            <a
              href="https://www.lesfoliestempsdanse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              www.lesfoliestempsdanse.com
            </a>
          </p>
          <p><span className="font-medium">Contact&nbsp;:</span>{" "}
            <a
              href="mailto:contact@lesfoliestempsdanse.com"
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              contact@lesfoliestempsdanse.com
            </a>
          </p>
        </div>
      </section>

      {/* 2. Directeur de publication */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">2. Directeur de la publication</h2>
        <p className="text-sm leading-relaxed">
          Le directeur de la publication est le représentant légal de l&apos;association
          les Folies Temps&apos;Danse.
        </p>
      </section>

      {/* 3. Hébergement */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">3. Hébergement</h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <p className="font-medium mb-1">Application web (frontend) :</p>
            <p>Vercel Inc.</p>
            <p>340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                vercel.com
              </a>
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Base de données et API (backend) :</p>
            <p>Convex, Inc.</p>
            <p>375 Alabama Street, San Francisco, CA 94110, États-Unis</p>
            <p>
              <a
                href="https://www.convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                convex.dev
              </a>
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Authentification :</p>
            <p>Clerk, Inc.</p>
            <p>
              <a
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                clerk.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Développement */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">4. Conception et développement</h2>
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            L&apos;application a été conçue et développée par&nbsp;:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span className="font-medium">Selenium Studio</span> —{" "}
              <a
                href="https://www.selenium-studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                selenium-studio.com
              </a>
            </li>
            <li>
              <span className="font-medium">Anatholy Bricon</span> —{" "}
              <a
                href="https://www.anatholy-bricon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                anatholy-bricon.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Propriété intellectuelle */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">5. Propriété intellectuelle</h2>
        <p className="text-sm leading-relaxed">
          L&apos;ensemble des éléments constituant l&apos;Application (structure, textes, images,
          visuels, interface graphique, logiciels, code source) est protégé par les
          dispositions du Code de la Propriété Intellectuelle et notamment par le droit
          d&apos;auteur, le droit des marques et le droit des bases de données.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          Toute représentation, reproduction, adaptation ou exploitation partielle ou
          totale des contenus, marques et services de l&apos;Application est strictement
          interdite sans autorisation préalable écrite de l&apos;éditeur.
        </p>
      </section>

      {/* 6. Données personnelles & RGPD */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">6. Protection des données personnelles (RGPD)</h2>
        <p className="text-sm leading-relaxed">
          L&apos;Application collecte et traite des données à caractère personnel dans le
          strict respect du Règlement Général sur la Protection des Données (RGPD —
          Règlement UE 2016/679) et de la loi n° 78-17 du 6 janvier 1978 relative à
          l&apos;informatique, aux fichiers et aux libertés, modifiée.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          Conformément à la réglementation applicable, vous disposez d&apos;un droit d&apos;accès,
          de rectification, d&apos;effacement, de limitation et d&apos;opposition au traitement
          de vos données. Pour exercer ces droits, veuillez contacter l&apos;éditeur à
          l&apos;adresse mentionnée à l&apos;article 1.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          Pour plus d&apos;informations sur le traitement de vos données, consultez notre{" "}
          <Link
            href="/politique-de-confidentialite"
            className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Politique de confidentialité
          </Link>
          .
        </p>
      </section>

      {/* 7. Cookies */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">7. Cookies et traceurs</h2>
        <p className="text-sm leading-relaxed">
          L&apos;Application utilise des cookies strictement nécessaires à son fonctionnement
          (authentification, session utilisateur). Aucun cookie publicitaire ou de suivi
          tiers n&apos;est utilisé à des fins commerciales.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          Conformément à l&apos;article 82 de la loi Informatique et Libertés, les cookies
          de fonctionnement ne nécessitent pas votre consentement préalable.
        </p>
      </section>

      {/* 8. Responsabilité */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">8. Limitation de responsabilité</h2>
        <p className="text-sm leading-relaxed">
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
          diffusées sur l&apos;Application. Toutefois, il ne saurait être tenu pour responsable
          des omissions, inexactitudes ou carences dans la mise à jour, qu&apos;elles soient
          de son fait ou des tiers partenaires ayant fourni ces informations.
        </p>
        <p className="text-sm leading-relaxed mt-2">
          L&apos;éditeur décline toute responsabilité pour tout dommage direct ou indirect
          résultant de l&apos;accès à l&apos;Application ou de son utilisation, y compris
          l&apos;inaccessibilité, les pertes de données, les détériorations ou virus qui
          pourraient affecter votre matériel informatique.
        </p>
      </section>

      {/* 9. Droit applicable */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-primary">9. Droit applicable et juridiction compétente</h2>
        <p className="text-sm leading-relaxed">
          Les présentes mentions légales sont soumises au droit français. En cas de
          litige et à défaut de résolution amiable, les tribunaux français seront
          seuls compétents.
        </p>
      </section>

      <footer className="border-t border-border pt-4 text-xs text-muted-foreground text-center space-y-1">
        <p>Dernière mise à jour&nbsp;: mars 2026</p>
        <p>
          <Link href="/politique-de-confidentialite" className="hover:text-primary transition-colors underline underline-offset-4">
            Politique de confidentialité
          </Link>
          {" · "}
          <Link href="/condition-d-utilisation" className="hover:text-primary transition-colors underline underline-offset-4">
            Conditions d&apos;utilisation
          </Link>
        </p>
      </footer>
    </article>
  </main>
);

export default MentionsLegales;
