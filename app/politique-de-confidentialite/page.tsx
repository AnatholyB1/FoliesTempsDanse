import React from "react";

const PolitiqueConfidentialite: React.FC = () => (
    <main className="flex justify-center items-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section className="w-full max-w-2xl rounded-[var(--radius-lg)] bg-[var(--card)] text-[var(--card-foreground)] shadow-lg p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Politique de confidentialité</h1>

            <div>
                <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
                <p>
                    La présente politique explique comment l’Application gère et protège les données des utilisateurs.<br />
                    L’Application est destinée exclusivement à la gestion d’activités de danse et de spectacle et ne collecte que les informations nécessaires à cet usage.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">2. Données collectées</h2>
                <ul className="list-disc pl-6 mb-2">
                    <li>Noms ou pseudonymes artistiques</li>
                    <li>Rôles dans un spectacle ou un événement</li>
                    <li>Horaires, plannings et disponibilités</li>
                    <li>Informations techniques nécessaires au fonctionnement du dashboard</li>
                </ul>
                <p>
                    Aucune donnée sensible (telle qu’adresse postale, informations financières, date de naissance, coordonnées personnelles non nécessaires) n’est collectée.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">3. Finalité de l’utilisation</h2>
                <ul className="list-disc pl-6 mb-2">
                    <li>Gérer les plannings, spectacles et répétitions</li>
                    <li>Faciliter la coordination entre les participants</li>
                    <li>Permettre le bon fonctionnement du dashboard</li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">4. Conservation des données</h2>
                <p>
                    Les données sont conservées uniquement pendant la durée nécessaire à la gestion des activités artistiques en cours.<br />
                    Elles sont supprimées ou anonymisées une fois l’activité terminée.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">5. Partage des données</h2>
                <p>
                    Les données ne sont jamais vendues, louées ou transmises à des tiers à des fins commerciales.<br />
                    Elles peuvent être partagées uniquement :
                </p>
                <ul className="list-disc pl-6 mb-2">
                    <li>Avec les membres autorisés d’une troupe ou équipe</li>
                    <li>Si la loi l’exige</li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">6. Sécurité</h2>
                <p>
                    Nous mettons en place des mesures techniques et organisationnelles pour protéger les données contre tout accès, modification ou suppression non autorisée.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">7. Droits des utilisateurs</h2>
                <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 mb-2">
                    <li>Accéder à vos données</li>
                    <li>Les rectifier</li>
                    <li>Demander leur suppression</li>
                    <li>Limiter ou refuser leur traitement</li>
                </ul>
                <p>
                    Pour exercer ces droits, contactez l’administrateur de l’Application.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
                <p>
                    Cette politique peut être mise à jour à tout moment.<br />
                    La version la plus récente est disponible directement dans l’Application.
                </p>
            </div>
        </section>
    </main>
);

export default PolitiqueConfidentialite;