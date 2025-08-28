"use client";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "sonner";
import {FileMusic, Pencil, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Id} from "@/convex/_generated/dataModel";
import {ChoregraphieDeleteDialog, ChoregraphieFormDialog, ChoregraphieFormValues} from "./dialog";
import {Choregraphie} from "@/type";
import Link from "next/link";

export default function ChoregraphiesPage() {
  const [open, setOpen] = useState<string>("");
  const {data: choregraphies, isPending: chPending} = useQuery(convexQuery(api.choregraphies.getChoregraphies, {}));
  const {data: tableaux} = useQuery(convexQuery(api.tableaux.getTableaux, {}));

  const {mutate: create, isPending: createPending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.createChoregraphie),
    onSuccess: () => {
      toast.success("Chorégraphie créée");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
  const {mutate: update, isPending: updatePending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.updateChoregraphie),
    onSuccess: () => {
      toast.success("Chorégraphie modifiée");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });
  const {mutate: remove, isPending: removePending} = useMutation({
    mutationFn: useConvexMutation(api.choregraphies.deleteChoregraphie),
    onSuccess: () => {
      toast.success("Chorégraphie supprimée");
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const handleCreate = async (values: ChoregraphieFormValues) => {
    create({
      nom: values.nom,
      tableauId: values.tableauId as Id<"tableaux">,
      musique: values.musique || "",
      duree: values.duree || undefined,
      description: values.description || "",
    });
  };

  const handleUpdate = async (id: Id<"choregraphies">, values: ChoregraphieFormValues) => {
    update({ id, data: {
      nom: values.nom,
      tableauId: values.tableauId as Id<"tableaux">,
      musique: values.musique || "",
      duree: values.duree || undefined,
      description: values.description || "",
      } });
  };

  if (chPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
          <FileMusic className="w-7 h-7 text-primary" /> Chorégraphies
        </h1>
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
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
          <FileMusic className="w-7 h-7 text-primary" /> Chorégraphies
        </h1>
        <p className="text-muted-foreground">Aucun tableau disponible. Veuillez créer un tableau pour ajouter des chorégraphies.</p>
        <Button variant="default" className="mt-4" >
          <Link href={"/tableaux"}>Tableaux</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mr-2">
          <FileMusic className="w-7 h-7 text-primary" /> Chorégraphies
        </h1>
        <ChoregraphieFormDialog
          open={open === "create"}
          onOpenChange={(open) => setOpen(open ? "create" : "")}
          loading={createPending}
          onSave={handleCreate}
          tableaux={tableaux ?? []}
        >
          <Button variant="default">Nouvelle chorégraphie</Button>
        </ChoregraphieFormDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {choregraphies?.map((chore : Choregraphie) => (
          <Card key={chore._id} className="relative border-border rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {chore.nom}
                {chore.tableauId && (
                  <Badge variant="secondary">
                    {tableaux?.find((t) => t._id === chore.tableauId)?.nom || "?"}
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
                 <Link href={`/choregraphies/${chore._id}`}>Détails</Link>
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
                  aria-label={`Supprimer la chorégraphie ${chore.nom}`}
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