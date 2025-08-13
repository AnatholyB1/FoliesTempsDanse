"use client";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Pencil, Proportions, Trash2} from "lucide-react";
import {TableauDeleteDialog, TableauFormDialog, TableauFormValues} from "./dialog";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Skeleton} from "@/components/ui/skeleton";
import {Id} from "@/convex/_generated/dataModel";
import {useState} from "react";
import Link from "next/link";

export default function TableauxPage() {
  const [open, setOpen] = useState<string>("");
  const { data: tableaux, isPending: tableauxPending } = useQuery(
    convexQuery(api.tableaux.getTableaux, {})
  );
  const { data: saisons, isPending: saisonsPending } = useQuery(
    convexQuery(api.saisons.getSaisons, {})
  );
  const { mutate: create, isPending: createPending } = useMutation({
    mutationFn: useConvexMutation(api.tableaux.createTableau),
    onSuccess: () => {
      toast.success("Tableau créé")
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la création du tableau"),
  });
  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: useConvexMutation(api.tableaux.updateTableau),
    onSuccess: () => {
      toast.success("Tableau modifié")
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la modification du tableau"),
  });
  const { mutate: remove, isPending: removePending } = useMutation({
    mutationFn: useConvexMutation(api.tableaux.deleteTableau),
    onSuccess: () => {
      toast.success("Tableau supprimé")
      setOpen("");
    },
    onError: () => toast.error("Erreur lors de la suppression du tableau"),
  });

  const handleCreate = async (values: TableauFormValues) => {
    create({
      nom: values.nom,
      saisonId: values.saisonId as Id<"saison">,
      description: values.description || "",
    });
  };

  const handleUpdate = async (id: Id<"tableaux">, values: TableauFormValues) => {
    update({ id, data: {
      nom: values.nom,
      saisonId: values.saisonId as Id<"saison">,
      description: values.description || "",
      } });
  };

  if (tableauxPending || saisonsPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mr-2">
            <Proportions className="w-7 h-7 text-primary" /> Tableaux
          </h1>
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="relative border-border rounded-lg p-4 shadow-sm bg-background">
              <div className="flex flex-row items-center gap-2 mb-2">
                <Skeleton className="w-20 h-6 rounded" />
                <Skeleton className="w-12 h-5 rounded" />
              </div>
              <div className="mb-2">
                <Skeleton className="w-16 h-4 rounded" />
              </div>
              <div className="mb-2">
                <Skeleton className="w-32 h-4 rounded" />
              </div>
              <div className="flex justify-between items-center w-full gap-2 mb-2">
                <Skeleton className="w-20 h-8 rounded" />
                <Skeleton className="w-20 h-8 rounded" />
              </div>
              <div className="flex justify-end items-center w-full gap-2">
                <Skeleton className="w-16 h-8 rounded" />
                <Skeleton className="w-16 h-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if(!saisons || saisons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Aucune saison disponible</h1>
        <p className="text-muted-foreground">
          Veuillez créer une saison avant de créer des tableaux.
        </p>
        <Button
          variant="default"
          className="mt-4"
        >
          <Link href="/saisons">Créer une saison</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mr-2">
          <Proportions className="w-7 h-7 text-primary" /> Tableaux
        </h1>
        <TableauFormDialog
          open={open === "create"}
          onOpenChange={(open) => setOpen(open ? "create" : "")}
          loading={createPending}
          onSave={handleCreate}
          saisons={saisons ?? []}
        >
          <Button variant="default">Nouveau tableau</Button>
        </TableauFormDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tableaux?.map((tableau) => (
          <Card key={tableau._id} className="relative border-border rounded-lg">
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                {tableau.nom}
                <Badge variant="default">
                  {saisons?.find((s) => s._id === tableau.saisonId)?.nom || "?"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-muted-foreground text-sm">
                {tableau.description}
              </div>
              <Button variant="outline">
                <Link href={`/choregraphies/?tableau=${tableau._id}`}>
                  Chorégraphies
                </Link>
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end items-center w-full gap-2">
              <Button
                size="sm"
                variant={"outline"}
                asChild
                className="flex items-center gap-1"
              >
                <Link href={`/tableaux/${tableau._id}`}>
                  <Proportions className="w-4 h-4 mr-1" />
                  Voir
                </Link>
              </Button>
              <TableauFormDialog
                open={open === `edit-${tableau._id}`}
                onOpenChange={(open) => setOpen(open ? `edit-${tableau._id}` : "")}
                editTableau={tableau}
                loading={updatePending}
                onSave={(values) => handleUpdate(tableau._id as Id<"tableaux">, values)}
                saisons={saisons ?? []}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  disabled={updatePending}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Modifier
                </Button>
              </TableauFormDialog>
              <TableauDeleteDialog
                open={open === `delete-${tableau._id}`}
                onOpenChange={(open) => setOpen(open ? `delete-${tableau._id}` : "")}
                tableauToDelete={tableau}
                onDelete={() => remove({ id: tableau._id as Id<"tableaux"> })}
                loading={removePending}
              >
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={removePending}
                  aria-label={`Supprimer le tableau ${tableau.nom}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
              </TableauDeleteDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}