import React from "react";

const ConditionsUtilisation: React.FC = () => (
    <main className="flex justify-center items-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section
            className="w-full max-w-2xl rounded-[var(--radius-lg)] bg-[var(--card)] text-[var(--card-foreground)] shadow-lg p-8 space-y-8"
        >
            <h1 className="text-3xl font-bold mb-6 text-center">Conditions d’utilisation</h1>

            <div>
                <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
                <p>
                    La présente application (ci-après « l’Application ») a pour but de faciliter la gestion et l’organisation d’activités liées à la danse et au spectacle.
                    Elle fournit un dashboard permettant d’accéder à des informations, de gérer des plannings et de suivre des données uniquement en rapport avec ces activités.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">2. Accès à l’Application</h2>
                <p>
                    L’Application est accessible gratuitement.<br />
                    Aucune transaction financière n’est réalisée via l’Application.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">3. Données collectées</h2>
                <p>
                    L’Application ne collecte aucune donnée personnelle autre que celles strictement nécessaires à la gestion des activités de danse et de spectacle (par exemple : noms artistiques, rôles dans un spectacle, horaires de répétition).<br />
                    Aucune donnée sensible ou non pertinente n’est demandée ni conservée.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">4. Utilisation autorisée</h2>
                <ul className="list-disc pl-6 mb-2">
                    <li>Organisation d’événements, répétitions ou spectacles</li>
                    <li>Gestion des équipes et ressources liées à la danse</li>
                    <li>Consultation et mise à jour des informations autorisées par l’administrateur</li>
                </ul>
                <p>
                    Toute utilisation à des fins illégales, publicitaires non autorisées ou contraires aux lois en vigueur est interdite.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">5. Propriété intellectuelle</h2>
                <p>
                    L’Application et ses contenus (textes, visuels, interface, codes) sont protégés par les lois sur la propriété intellectuelle.<br />
                    Toute reproduction, modification ou diffusion non autorisée est interdite.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">6. Limitation de responsabilité</h2>
                <ul className="list-disc pl-6">
                    <li>D’interruption temporaire ou définitive de l’Application</li>
                    <li>De perte ou altération de données</li>
                    <li>D’utilisation non conforme par l’utilisateur</li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">7. Modifications</h2>
                <p>
                    Les présentes conditions peuvent être modifiées à tout moment.<br />
                    La version en vigueur est celle affichée dans l’Application.
                </p>
            </div>
        </section>
    </main>
);

export default ConditionsUtilisation;