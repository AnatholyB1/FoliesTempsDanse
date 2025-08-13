// Fichier : app/tableaux/[id]/page.tsx

"use client";
import {useParams} from "next/navigation";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "sonner";
import {closestCenter, DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Proportions, Trash2} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {Choregraphie, Tableau} from "@/type";

// --- Composant principal ---
export default function TableauPage() {
  const params = useParams();
  const tableauId = params.id as Id<"tableaux">;

  // Récupération des données
  const {data: tableau, isPending: tableauPending} = useQuery(convexQuery(api.tableaux.getTableau, {id: tableauId}));
  const {data: choregraphies, isPending: chPending} = useQuery(convexQuery(api.choregraphies.getByTableau, {tableauId}));
  const {data: allChoregraphies, isPending: allChPending} = useQuery(convexQuery(api.choregraphies.getNotInTableau, {tableauId}));

  // Mutations
  const {mutate: lier, isPending: lierPending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.lierATableau),
    onSuccess: () => toast.success("Chorégraphie liée"),
    onError: () => toast.error("Erreur lors de l’ajout"),
  });
  const {mutate: detacher, isPending: detacherPending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.detacherDeTableau),
    onSuccess: () => toast.success("Chorégraphie détachée"),
    onError: () => toast.error("Erreur lors du retrait"),
  });
  const {mutate: reorder, isPending: reorderPending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.reorderInTableau),
    onError: () => toast.error("Erreur lors du réordonnancement"),
  });

  // Drag & drop state
  const [items, setItems] = useState<string[]>([]);

  // Sync items avec chorégraphies liées
  useEffect(() => {
    if (choregraphies) setItems(choregraphies.map(c => c._id));
  }, [choregraphies]);

  // Drag & drop handlers
  function handleDragEnd(event : DragEndEvent ) {
    const {active, over} = event;
    if (!over || !active) return;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());
      const newOrder  = arrayMove(items, oldIndex, newIndex) as Id<"choregraphies">[];
      setItems(newOrder);
      reorder({ order: newOrder});
    }
  }

  if (tableauPending || chPending || allChPending) {
    return <TableauDetailSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8 h-full">
      <TableauHeader tableau={tableau} />
      <ChoregraphiesPanel
        linked={choregraphies ?? []}
        available={allChoregraphies ?? []}
        items={items}
        onLier={(cId : Id<"choregraphies">) => lier({id: cId, tableauId})}
        onDetacher={(cId : Id<"choregraphies">) => detacher({id: cId})}
        onDragEnd={handleDragEnd}
        lierPending={lierPending}
        detacherPending={detacherPending}
        reorderPending={reorderPending}
      />
    </div>
  );
}

// --- Skeleton de chargement ---
function TableauDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <Skeleton className="h-10 w-1/2 mb-4" />
      <div className="flex gap-8">
        <Skeleton className="h-64 w-1/2" />
        <Skeleton className="h-64 w-1/2" />
      </div>
    </div>
  );
}

// --- Header du tableau ---
function TableauHeader({tableau}: {tableau: Tableau}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Proportions className="w-6 h-6 text-primary" />
          {tableau.nom}
          <Badge variant="secondary">{tableau.saisonId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">{tableau.description}</div>
      </CardContent>
    </Card>
  );
}

// --- Panel principal chorégraphies ---
type ChoregraphiesPanelProps = {
  linked: Choregraphie[];
  available: Choregraphie[];
  items: string[];
  onLier: (cId: Id<"choregraphies">) => void;
  onDetacher: (cId : Id<"choregraphies">) => void;
  onDragEnd: (event: DragEndEvent ) => void;
  lierPending: boolean;
  detacherPending: boolean;
  reorderPending: boolean;
}
function ChoregraphiesPanel({
                              linked, available,  items, onLier, onDetacher, onDragEnd, lierPending, detacherPending, reorderPending
                            }: ChoregraphiesPanelProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full ">
      <div className="flex-1 bg-accent p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Chorégraphies disponibles</h2>
        <ChoregraphiesAvailable
          choregraphies={available}
          onLier={onLier}
          lierPending={lierPending}
        />
      </div>
      <div className="flex-1 bg-accent p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Chorégraphies du tableau</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ChoregraphiesLinked
              choregraphies={linked}
              items={items}
              onDetacher={onDetacher}
              detacherPending={detacherPending}
              reorderPending={reorderPending}
            />
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// --- Liste des chorégraphies disponibles ---
type ChoregraphiesAvailableProps = {
  choregraphies: Choregraphie[];
  onLier: (cId: Id<"choregraphies">) => void;
  lierPending: boolean;
}
function ChoregraphiesAvailable({choregraphies, onLier, lierPending}: ChoregraphiesAvailableProps) {
  if (!choregraphies.length) return <div className="text-muted-foreground">Aucune à lier</div>;
  return (
    <div className="flex flex-col gap-2">
      {choregraphies.map((c: Choregraphie) => (
        <ChoregraphieCard
          key={c._id}
          choregraphie={c}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLier(c._id)}
              disabled={lierPending}
            >
              Lier
            </Button>
          }
        />
      ))}
    </div>
  );
}

// --- Liste des chorégraphies liées (sortable) ---
type ChoregraphiesLinkedProps = {
  choregraphies: Choregraphie[];
  items: string[];
  onDetacher: (cId: Id<"choregraphies">) =>
    void;
  detacherPending: boolean;
  reorderPending: boolean;
}
function ChoregraphiesLinked({choregraphies, items, onDetacher, detacherPending, reorderPending}: ChoregraphiesLinkedProps) {
  if (!items.length) return <div className="text-muted-foreground">Aucune chorégraphie liée</div>;
  return (
    <div className="flex flex-col gap-2">
      {items.map((id: string) => {
        const c = choregraphies.find((c) => c._id === id);
        if (!c) return null;
        return (
          <SortableChoregraphieCard
            key={c._id}
            choregraphie={c}
            onDetacher={onDetacher}
            detacherPending={detacherPending}
            reorderPending={reorderPending}
          />
        );
      })}
    </div>
  );
}

// --- Carte chorégraphie simple ---
type ChoregraphieCardProps = {
  choregraphie: Choregraphie;
  action: React.ReactNode;
}
function ChoregraphieCard({choregraphie, action}: ChoregraphieCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between px-4 py-2">
      <div>
        <div className="font-medium">{choregraphie.nom}</div>
        <div className="text-xs text-muted-foreground">{choregraphie.musique}</div>
      </div>
      {action}
    </Card>
  );
}

// --- Carte chorégraphie sortable (drag & drop) ---
type SortableChoregraphieCardProps = {
  choregraphie: Choregraphie;
  onDetacher: (cId: Id<"choregraphies">) => void;
  detacherPending: boolean;
  reorderPending: boolean;
}
function SortableChoregraphieCard({choregraphie, onDetacher, detacherPending, reorderPending}: SortableChoregraphieCardProps) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: choregraphie._id});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <Card ref={setNodeRef} style={style} className="flex flex-row items-center justify-between px-4 py-2">
      <div {...attributes} {...listeners} className="flex-1 flex flex-col cursor-grab">
        <div className="font-medium">{choregraphie.nom}</div>
        <div className="text-xs text-muted-foreground">{choregraphie.musique}</div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDetacher(choregraphie._id)}
        disabled={detacherPending || reorderPending}
        aria-label="Détacher"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </Card>
  );
}