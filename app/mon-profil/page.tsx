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
import Image from "next/image";
import { Clock, FileMusic, Glasses, Proportions, Shirt } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

type TableauCount = { blocId: string | null; blocNom: string; count: number };

type Stats = {
  chorees: number;
  costumesUniques: number;
  accessoiresUniques: number;
  dureeTotaleSeconds: number;
  choreesParTableau: TableauCount[];
  tempsMoyenEntrePassagesSeconds?: number | null;
};

type CostumeDoc = { _id: string; descriptif?: string; photo?: string; couleur?: string };
type AccessoireDoc = { _id: string; descriptif?: string; photo?: string; couleur?: string };

type TableauDetail = {
  _id: Id<"choregraphies">;
  nom: string;
  ordre?: number;
  duree?: number;
  blocId: Id<"tableaux"> | null;
  blocNom: string;
  costumes: CostumeDoc[];
  accessoires: AccessoireDoc[];
};

/* ── Helpers ────────────────────────────────────────────────────────── */

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

/* ── Stat chip ──────────────────────────────────────────────────────── */

function Stat({ label, value, isText = false }: { label: string; value: number | string; isText?: boolean }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-center">
      <div className={`text-base font-semibold ${isText ? "" : "tabular-nums"}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

/* ── Stats header card ──────────────────────────────────────────────── */

function StatsCard({
  danseuse,
  saison,
  stats,
}: {
  danseuse: { _id: string; nom: string };
  saison: { _id: string; nom: string; annee: string } | null;
  stats: Stats;
}) {
  const maxBar = Math.max(1, ...stats.choreesParTableau.map((t) => t.count));
  const totalChorees = stats.choreesParTableau.reduce((a, b) => a + b.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="font-semibold">{initials(danseuse.nom)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{danseuse.nom}</CardTitle>
          <CardDescription>{saison ? `${saison.nom} ${saison.annee}` : "Saison"}</CardDescription>
        </div>
        {typeof stats.tempsMoyenEntrePassagesSeconds === "number" && (
          <Badge variant="secondary" className="shrink-0">
            ⏱️ {formatDuree(stats.tempsMoyenEntrePassagesSeconds)} moy.
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Tableaux" value={stats.chorees} />
          <Stat label="Costumes" value={stats.costumesUniques} />
          <Stat label="Accessoires" value={stats.accessoiresUniques} />
          <Stat label="Durée totale" value={formatDuree(stats.dureeTotaleSeconds)} isText />
        </div>

        {stats.choreesParTableau.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Tableaux par bloc</p>
              <p className="text-xs text-muted-foreground">{totalChorees} au total</p>
            </div>
            <ul className="space-y-2">
              {stats.choreesParTableau.map((t, i) => (
                <li key={i}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate flex items-center gap-1">
                      <Proportions className="w-3 h-3 text-muted-foreground shrink-0" />
                      {t.blocNom}
                    </span>
                    <span className="text-muted-foreground tabular-nums">{t.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${(t.count / maxBar) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Equipment chip ─────────────────────────────────────────────────── */

function EquipmentChip({ item, icon }: { item: CostumeDoc | AccessoireDoc; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5">
      <div className="shrink-0 w-8 h-8 rounded border bg-muted overflow-hidden flex items-center justify-center">
        {item.photo
          ? <Image src={item.photo} alt={item.descriptif ?? ""} width={32} height={32} className="object-cover w-full h-full" />
          : <span className="text-muted-foreground/50">{icon}</span>}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate leading-tight">{item.descriptif ?? "—"}</p>
        {item.couleur && <p className="text-[10px] text-muted-foreground truncate">{item.couleur}</p>}
      </div>
    </div>
  );
}

/* ── Tableaux list ──────────────────────────────────────────────────── */

function TableauxCard({ tableaux }: { tableaux: TableauDetail[] }) {
  if (tableaux.length === 0) return null;

  const byBloc = new Map<string, { blocNom: string; items: TableauDetail[] }>();
  for (const t of tableaux) {
    const key = t.blocId ?? "no_bloc";
    const entry = byBloc.get(key) ?? { blocNom: t.blocNom, items: [] };
    entry.items.push(t);
    byBloc.set(key, entry);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <FileMusic className="w-4 h-4" /> Mes tableaux
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {Array.from(byBloc.values()).map((bloc) => (
          <div key={bloc.blocNom}>
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Proportions className="w-3 h-3" /> {bloc.blocNom}
            </p>
            <ul className="space-y-3">
              {bloc.items.map((t) => (
                <li key={t._id} className="rounded-lg border bg-accent/30 overflow-hidden">
                  <Link
                    href={`/tableaux/${t._id}`}
                    className="flex items-center justify-between px-3 py-2 hover:bg-accent transition-colors"
                  >
                    <span className="text-sm font-semibold truncate">{t.nom}</span>
                    {t.duree != null && t.duree > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1 shrink-0 ml-2">
                        <Clock className="w-3 h-3" />
                        {formatDuree(t.duree)}
                      </span>
                    )}
                  </Link>
                  {(t.costumes.length > 0 || t.accessoires.length > 0) && (
                    <div className="px-3 pb-3 space-y-2">
                      {t.costumes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <Shirt className="w-3 h-3" /> Costumes
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                            {t.costumes.map((c) => (
                              <EquipmentChip key={c._id} item={c} icon={<Shirt className="w-3.5 h-3.5" />} />
                            ))}
                          </div>
                        </div>
                      )}
                      {t.accessoires.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <Glasses className="w-3 h-3" /> Accessoires
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                            {t.accessoires.map((a) => (
                              <EquipmentChip key={a._id} item={a} icon={<Glasses className="w-3.5 h-3.5" />} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function Page() {
  const { data, isPending, error } = useQuery(convexQuery(api.users.myStats, {}));

  if (isPending) return <div className="p-4 text-sm text-muted-foreground">Chargement…</div>;
  if (error) return <div className="p-4 text-sm text-destructive">Erreur : {String(error.message ?? error)}</div>;
  if (!data || data.status !== "ok") return <div className="p-4 text-sm text-muted-foreground">Aucune donnée</div>;

  return (
    <main className="mx-auto max-w-[720px] p-4 space-y-4">
      <StatsCard danseuse={data.danseuse} saison={data.saison} stats={data.stats} />
      <TableauxCard tableaux={data.tableaux as unknown as TableauDetail[]} />
    </main>
  );
}
