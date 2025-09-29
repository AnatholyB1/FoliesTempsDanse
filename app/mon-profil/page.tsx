"use client"
import * as React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

type TableauCount = { tableauId: string | null; tableauNom: string; count: number };
type Stats = {
  chorees: number;
  costumesUniques: number;
  accessoiresUniques: number;
  dureeTotaleSeconds: number;
  choreesParTableau: TableauCount[];
  tempsMoyenEntrePassagesSeconds?: number | null;
};
type Props = {
  danseuse: { _id: string; nom: string };
  saison: { _id: string; nom: string; annee: string } | null;
  stats: Stats;
};

export function EspaceDanseuseStatsCard({ danseuse, saison, stats }: Props) {
  const maxBar = Math.max(1, ...stats.choreesParTableau.map((t) => t.count));
  const totalChorees = stats.choreesParTableau.reduce((a, b) => a + b.count, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="font-semibold">
            {initials(danseuse.nom)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{danseuse.nom}</CardTitle>
          <CardDescription className="text-slate-500">
            {saison ? `${saison.nom} ${saison.annee}` : "Saison"}
          </CardDescription>
        </div>
        {typeof stats.tempsMoyenEntrePassagesSeconds === "number" && (
          <Badge variant="secondary" className="shrink-0">
            ⏱️ {formatDuree(stats.tempsMoyenEntrePassagesSeconds)}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats principales */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Chorégraphies" value={stats.chorees} />
          <Stat label="Costumes uniques" value={stats.costumesUniques} />
          <Stat label="Accessoires uniques" value={stats.accessoiresUniques} />
          <Stat label="Durée totale" value={formatDuree(stats.dureeTotaleSeconds)} isText />
        </div>

        {/* Histogramme: Chorégraphies par tableau */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">Chorégraphies par tableau</div>
            <div className="text-xs text-slate-500">{totalChorees} au total</div>
          </div>
          {stats.choreesParTableau.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-slate-500">
              Aucune chorégraphie assignée.
            </div>
          ) : (
            <ul className="space-y-2">
              {stats.choreesParTableau.map((t, i) => (
                <li key={i}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate">{t.tableauNom}</span>
                    <span className="text-slate-500">{t.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${(t.count / maxBar) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, isText = false }: { label: string; value: number | string; isText?: boolean }) {
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-center">
      <div className={`text-base font-semibold ${isText ? "" : "tabular-nums"}`}>{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "??";
}

function formatDuree(seconds?: number | null) {
  if (!seconds || isNaN(Number(seconds))) return "0:00";
  const s = Math.max(0, Number(seconds));
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
}

export default function Page() {
  const { data, isPending, error } = useQuery(convexQuery(api.users.myStats, {}));
  if (isPending) return <div className="p-4 text-sm text-slate-500">Chargement…</div>;
  if (error) return <div className="p-4 text-sm text-red-600">Erreur: {String(error.message ?? error)}</div>;
  if (!data || data.status !== "ok") return <div className="p-4">Aucune donnée</div>;

  return (
    <main className="mx-auto max-w-[720px] p-4">
      <EspaceDanseuseStatsCard
        danseuse={data.danseuse}
        saison={data.saison}
        stats={data.stats}
      />
    </main>
  );
}