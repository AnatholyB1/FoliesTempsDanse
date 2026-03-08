"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Glasses,
  Loader2,
  Shirt,
  UserCheck,
  UserX,
  Leaf,
  FileMusic,
  Proportions,
  ArrowRight,
  Music,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { CreateCostumeDialog } from "@/app/costumes/dialog";
import { CreateAccessoireDialog } from "@/app/accessoires/dialog";
import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/* ── Status badge ─────────────────────────────────────────────────────── */

type UserStatusBarProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

function UserStatusBar({ isLoading, isAuthenticated }: UserStatusBarProps) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="animate-spin w-3.5 h-3.5" />
        Chargement…
      </span>
    );
  }
  if (isAuthenticated) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium"
        style={{ color: "var(--gold)" }}>
        <UserCheck className="w-3.5 h-3.5" />
        Connecté
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-destructive font-medium">
      <UserX className="w-3.5 h-3.5" />
      Non connecté
    </span>
  );
}

/* ── Dashboard card ───────────────────────────────────────────────────── */

type DashboardCardConfig = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  dialog?: React.ReactNode;
};

function DashboardCard({ title, description, href, icon, dialog }: DashboardCardConfig) {
  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Accent top bar */}
      <span
        className="absolute top-0 inset-x-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden
      />

      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        {/* Icon badge */}
        <span className="mt-0.5 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-semibold leading-snug">{title}</CardTitle>
          <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border/50">
        {dialog ?? <span />}
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all duration-200"
          aria-label={`Accéder à ${title.toLowerCase()}`}
        >
          Accéder
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

/* ── Landing page ────────────────────────────────────────────────────── */

const landingFeatures = [
  {
    icon: <Shirt className="w-6 h-6" />,
    title: "Costumes & Accessoires",
    description: "Référencez chaque pièce avec photo, couleur, taille, quantité et emplacement. Retrouvez n'importe quel élément en quelques secondes.",
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: "Tableaux & Chorégraphies",
    description: "Organisez vos spectacles en blocs et tableaux. Assignez costumes et accessoires à chaque danseuse ou groupe d'un seul clic.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Danseuses & Groupes",
    description: "Gérez les rôles, les groupes et les équipements de chaque danseuse tableau par tableau, avec un suivi du stock en temps réel.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Saisons",
    description: "Archivez chaque saison de la compagnie. Retrouvez l'historique complet des spectacles et des assignations.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Mon Profil",
    description: "Chaque danseuse accède à son espace personnel : ses tableaux, ses costumes et accessoires, sa durée de scène totale.",
  },
  {
    icon: <Glasses className="w-6 h-6" />,
    title: "Stock en temps réel",
    description: "Les quantités sont automatiquement mises à jour à chaque assignation ou retour. Fini les surprises le jour J.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        {/* Gradient blob */}
        <div
          className="absolute -z-10 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--primary)", top: "-100px", left: "50%", transform: "translateX(-50%)" }}
          aria-hidden
        />

        {/* Logo / brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg text-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            F
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-none mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          les Folies
          <br />
          <span className="text-primary">Temps&apos;Danse</span>
        </h1>

        {/* Gold ornament */}
        <div className="flex items-center justify-center gap-3 my-5" aria-hidden>
          <span className="h-px flex-1 max-w-[120px]" style={{ background: "var(--gold)" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="h-px flex-1 max-w-[120px]" style={{ background: "var(--gold)" }} />
        </div>

        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
          La plateforme de gestion de la compagnie&nbsp;—
          costumes, accessoires, chorégraphies et danseuses, tout en un.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <SignInButton mode="modal">
            <Button size="lg" className="px-8 text-base shadow-lg">
              Se connecter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </SignInButton>
          <Link
            href="/condition-d-utilisation"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Conditions d&apos;utilisation
          </Link>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="flex-1 px-6 py-16 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Tout ce dont la compagnie a besoin
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Une seule application, conçue pour les compagnies de danse.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landingFeatures.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary">
                  {f.icon}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <section className="px-6 py-12 text-center border-t">
        <p className="text-sm text-muted-foreground mb-4">
          Vous avez déjà un compte&nbsp;? Connectez-vous pour accéder à votre espace.
        </p>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Se connecter
          </Button>
        </SignInButton>
      </section>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function Home() {
  const [openCostumeDialog, setOpenCostumeDialog] = useState(false);
  const [openAccessoireDialog, setOpenAccessoireDialog] = useState(false);
  const { isLoading, isAuthenticated } = useStoreUserEffect();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const dashboardCards: DashboardCardConfig[] = [
    {
      title: "Costumes",
      description: "Visualisez, ajoutez et gérez tous vos costumes.",
      href: "/costumes",
      icon: <Shirt className="w-5 h-5" />,
      dialog: (
        <CreateCostumeDialog
          open={openCostumeDialog}
          onOpenChange={setOpenCostumeDialog}
          onEdit={(edited) => setOpenCostumeDialog(!edited)}
        />
      ),
    },
    {
      title: "Accessoires",
      description: "Visualisez, ajoutez et gérez tous vos accessoires.",
      href: "/accessoires",
      icon: <Glasses className="w-5 h-5" />,
      dialog: (
        <CreateAccessoireDialog
          open={openAccessoireDialog}
          onOpenChange={setOpenAccessoireDialog}
          onEdit={(edited) => setOpenAccessoireDialog(!edited)}
        />
      ),
    },
    {
      title: "Utilisateurs",
      description: "Gérez les utilisateurs et leurs rôles.",
      href: "/users",
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      title: "Saisons",
      description: "Gérez les saisons de vos spectacles.",
      href: "/saisons",
      icon: <Leaf className="w-5 h-5" />,
    },
    {
      title: "Blocs",
      description: "Gérez les blocs de vos spectacles.",
      href: "/blocs",
      icon: <Proportions className="w-5 h-5" />,
    },
    {
      title: "Tableaux",
      description: "Gérez les tableaux de vos spectacles.",
      href: "/tableaux",
      icon: <FileMusic className="w-5 h-5" />,
    },
  ];

  return (
    <main className="flex flex-col items-center px-6 py-10 min-h-0">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mb-10 text-center">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          les Folies{" "}
          <span className="text-primary">Temps&apos;Danse</span>
        </h1>

        {/* Gold ornamental line */}
        <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
          <span className="h-px flex-1 max-w-[80px]" style={{ background: "var(--gold)" }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="h-px flex-1 max-w-[80px]" style={{ background: "var(--gold)" }} />
        </div>

        <p className="text-sm text-muted-foreground tracking-widest uppercase font-medium">
          Direction &amp; Gestion de la Compagnie
        </p>

        {/* Status */}
        <div className="mt-4 flex justify-center">
          <UserStatusBar isLoading={isLoading} isAuthenticated={isAuthenticated} />
        </div>
      </section>

      {/* ── Cards grid ────────────────────────────────────────── */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </section>
    </main>
  );
}

