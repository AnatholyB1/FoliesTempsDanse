"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Glasses,
  Loader2,
  Shirt,
  SquareArrowOutUpRight,
  UserCheck,
  UserX,
  Leaf,
  FileMusic,
  Proportions,
} from "lucide-react";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { CreateCostumeDialog } from "@/app/costumes/dialog";
import { CreateAccessoireDialog } from "@/app/accessoires/dialog";
import { useState } from "react";

type UserStatusBarProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

function UserStatusBar({ isLoading, isAuthenticated }: UserStatusBarProps) {
  let icon, text, textClass;
  if (isLoading) {
    icon = <Loader2 className="animate-spin text-primary w-5 h-5" />;
    text = "Chargement...";
    textClass = "text-primary font-medium";
  } else if (isAuthenticated) {
    icon = <UserCheck className="text-primary w-5 h-5" />;
    text = "Connecté";
    textClass = "font-medium";
  } else {
    icon = <UserX className="text-destructive w-5 h-5" />;
    text = "Non connecté";
    textClass = "text-destructive font-medium";
  }
  return (
    <div className="w-full flex items-center justify-start mb-8">
      <div className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--card)] text-[var(--card-foreground)] shadow border border-[var(--border)] min-w-[220px]">
        {icon}
        <span className={textClass}>{text}</span>
      </div>
    </div>
  );
}

type DashboardCardConfig = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  dialog?: React.ReactNode;
};

function DashboardCard({
  title,
  description,
  href,
  icon,
  dialog,
}: DashboardCardConfig) {
  return (
    <Card className="min-w-[300px] max-w-[400px] min-h-[320px] flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <span className="bg-primary/10 rounded-full p-2">{icon}</span>
        <div className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <CardAction>
          <Link
            href={href}
            className="text-primary hover:underline"
            aria-label={`Voir ${title.toLowerCase()}`}
          >
            <SquareArrowOutUpRight />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground text-sm space-y-1">
          <li>• Aperçu rapide</li>
          <li>• Gestion et ajout</li>
          <li>• Statistiques</li>
        </ul>
      </CardContent>
      <CardFooter>{dialog}</CardFooter>
    </Card>
  );
}

export default function Home() {
  const [openCostumeDialog, setOpenCostumeDialog] = useState(false);
  const [openAccessoireDialog, setOpenAccessoireDialog] = useState(false);
  // const [openSaisonDialog, setOpenSaisonDialog] = useState(false); // Pour la saison si besoin
  const { isLoading, isAuthenticated } = useStoreUserEffect();

  const dashboardCards: DashboardCardConfig[] = [
    {
      title: "Costumes",
      description: "Visualisez, ajoutez et gérez tous vos costumes.",
      href: "/costumes",
      icon: <Shirt className="w-7 h-7 text-primary" />,
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
      icon: <Glasses className="w-7 h-7 text-primary" />,
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
      icon: <UserCheck className="w-7 h-7 text-primary" />,
    },
    {
      title: "Saisons",
      description: "Gérez les saisons de vos spectacles.",
      href: "/saisons",
      icon: <Leaf className="w-7 h-7 text-primary" />,
    },
    {
      title: "Tableaux",
      description: "Gérez les tableaux de vos spectacles.",
      href: "/tableaux",
      icon: <Proportions className="w-7 h-7 text-primary" />,
    },
    {
      title: "Chorégraphies",
      description: "Gérez les chorégraphies de vos spectacles.",
      href: "/choregraphies",
      icon: <FileMusic className="w-7 h-7 text-primary" />,
    },
  ];

  return (
    <div className="min-h-0 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-6">
      <UserStatusBar isLoading={isLoading} isAuthenticated={isAuthenticated} />
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
