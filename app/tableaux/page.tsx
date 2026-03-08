"use client";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "sonner";
import {Copy, FileMusic, Pencil, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Id} from "@/convex/_generated/dataModel";
import {ChoregraphieDeleteDialog, ChoregraphieFormDialog, ChoregraphieFormValues} from "./dialog";
import {Choregraphie} from "@/type";
import Link from "next/link";

export default function ChoregraphiesPage() {
  const [open, setOpen] = useState<string>("");
  const {data: choregraphies, isPending: chPending} = useQuery(convexQuery(api.tableaux.getTableaux, {}));
  const {data: tableaux} = useQuery(convexQuery(api.blocs.getBlocs, {}));

  const {mutate: create, isPending: createPending} = useMutation({
    mutationFn: useConvexMutation(api.tableaux.createTableau),
    onSuccess: () => {
      toast.success("Tableau créé");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
  const {mutate: update, isPending: updatePending} = useMutation({
    mutationFn: useConvexMutation(api.tableaux.updateTableau),
    onSuccess: () => {
      toast.success("Tableau modifié");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });
  const {mutate: remove, isPending: removePending} = useMutation({
    mutationFn: useConvexMutation(api.tableaux.deleteTableau),
    onSuccess: () => {
      toast.success("Tableau supprimé");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });
  const { mutate: duplicate, isPending: duplicatePending } = useMutation({
    mutationFn: useConvexMutation(api.tableaux.duplicateTableau),
    onSuccess: () => toast.success("Tableau dupliqué"),
    onError: () => toast.error("Erreur lors de la duplication"),
  });

  const handleCreate = async (values: ChoregraphieFormValues) => {
    create({
      nom: values.nom,
      blocId: values.blocId as Id<"tableaux">,
      musique: values.musique || "",
      duree: values.duree || undefined,
      description: values.description || "",
    });
  };

  const handleUpdate = async (id: Id<"choregraphies">, values: ChoregraphieFormValues) => {
    update({ id, data: {
      nom: values.nom,
      blocId: values.blocId as Id<"tableaux">,
      musique: values.musique || "",
      duree: values.duree || undefined,
      description: values.description || "",
      } });
  };

  if (chPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
            <FileMusic className="w-7 h-7 text-primary" /> Tableaux
          </h1>
          <div className="flex items-center gap-2 mt-2" aria-hidden>
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if(!tableaux) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
            <FileMusic className="w-7 h-7 text-primary" /> Tableaux
          </h1>
          <div className="flex items-center gap-2 mt-2" aria-hidden>
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
          </div>
        </div>
        <p className="text-muted-foreground">Aucun bloc disponible. Veuillez créer un bloc pour ajouter des tableaux.</p>
        <Button variant="default" className="mt-4" >
          <Link href={"/blocs"}>Blocs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
            <FileMusic className="w-7 h-7 text-primary" /> Tableaux
          </h1>
          <div className="flex items-center gap-2 mt-2" aria-hidden>
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
          </div>
        </div>
        <ChoregraphieFormDialog
          open={open === "create"}
          onOpenChange={(open) => setOpen(open ? "create" : "")}
          loading={createPending}
          onSave={handleCreate}
          tableaux={tableaux ?? []}
        >
          <Button variant="default">Nouveau tableau</Button>
        </ChoregraphieFormDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {choregraphies?.map((chore : Choregraphie) => (
          <Card key={chore._id} className="relative border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {chore.nom}
                {chore.blocId && (
                  <Badge variant="secondary">
                    {tableaux?.find((t) => t._id === chore.blocId)?.nom || "?"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm mb-2">
                {chore.musique}
              </div>
              <div className="mb-2">{chore.description}</div>
            </CardContent>
            <CardFooter className="flex justify-end items-center w-full gap-2">
              <Button
                size="sm"
                className="mr-2"
              >
                 <Link href={`/tableaux/${chore._id}`}>Détails</Link>
              </Button>
              <ChoregraphieFormDialog
                open={open === `edit-${chore._id}`}
                onOpenChange={(open) => setOpen(open ? `edit-${chore._id}` : "")}
                editChoregraphie={chore}
                loading={updatePending}
                onSave={(values) => handleUpdate(chore._id as Id<"choregraphies">, values)}
                tableaux={tableaux ?? []}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  disabled={updatePending}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Modifier
                </Button>
              </ChoregraphieFormDialog>
              <Button
                size="sm"
                variant="outline"
                onClick={() => duplicate({ id: chore._id as Id<"choregraphies"> })}
                disabled={duplicatePending}
                title="Dupliquer"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <ChoregraphieDeleteDialog
                open={open === `delete-${chore._id}`}
                onOpenChange={(open) => setOpen(open ? `delete-${chore._id}` : "")}
                choregraphieToDelete={chore}
                onDelete={() => remove({ id: chore._id as Id<"choregraphies"> })}
                loading={removePending}
              >
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={removePending}
                  aria-label={`Supprimer le tableau ${chore.nom}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
              </ChoregraphieDeleteDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}