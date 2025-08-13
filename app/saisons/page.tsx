"use client";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {CheckCircle2, Leaf, Loader2, Pencil, Trash2} from "lucide-react";
import {SaisonDeleteDialog, SaisonFormDialog, SaisonFormValues,} from "./dialog";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Skeleton} from "@/components/ui/skeleton";
import {Id} from "@/convex/_generated/dataModel";
import {useState} from "react";

export default function SaisonsPage() {
  const [open, setOpen] = useState<string>("")
  const { data: saisons, isPending: dataPending } = useQuery(
    convexQuery(api.saisons.getSaisons, {})
  );
  const { mutate: create, isPending: createPending } = useMutation({
    mutationFn: useConvexMutation(api.saisons.createSaison),
    onSuccess: () => {
      toast.success("Saison créée");
      setOpen("");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la saison");
    },
  });
  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: useConvexMutation(api.saisons.updateSaison),
    onSuccess: () => {
      toast.success("Saison modifiée");
      setOpen("");
    },
    onError: () => {
      toast.error("Erreur lors de la modification de la saison");
    },
  });
  const { mutate: remove, isPending: removePending } = useMutation({
    mutationFn: useConvexMutation(api.saisons.deleteSaison),
    onSuccess: () => {
      toast.success("Saison supprimée");
      setOpen("");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la saison");
    },
  });

  // Handlers CRUD (à connecter à Convex)
  const handleActivate = async (id: Id<"saison">) => {
    update({ id, active: true });
  };

  const handleCreate = async (values: SaisonFormValues) => {
    create(values);
  };

  const handleUpdate = async (id: Id<"saison">, values: SaisonFormValues) => {
    update({ id, ...values });
  };

  if (dataPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mr-2">
            <Leaf className="w-7 h-7 text-primary" /> Saisons
          </h1>
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="relative border-border rounded-lg p-4 shadow-sm bg-background"
            >
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
                <Skeleton className="w-20 h-8 rounded" />
              </div>
              <div className="flex justify-end items-center w-full gap-2">
                <Skeleton className="w-16 h-8 rounded" />
                <Skeleton className="w-16 h-8 rounded" />
                <Skeleton className="w-16 h-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mr-2">
          <Leaf className="w-7 h-7 text-primary" /> Saisons
        </h1>
        <SaisonFormDialog
          open={open === "create"}
          onOpenChange={(open) => {
            if (open) {
              setOpen("create");
            } else {
              setOpen("");
            }
          }}
          loading={createPending}
          onSave={handleCreate}
          editSaison={null}
        >
          <Button variant="default">Nouvelle saison</Button>
        </SaisonFormDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {saisons?.map((saison) => (
          <Card
            key={saison._id}
            className={`relative ${saison.active ? "border-primary shadow-lg" : "border-border"}`}
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                {saison.active && (
                  <Badge className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Active
                  </Badge>
                )}
                {saison.nom}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm mb-2">
                Année : {saison.annee}
              </div>
              <div className="mb-2">{saison.description}</div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex justify-between items-center w-full gap-2">
                <Link href={`/tableaux?saison=${saison._id}`} passHref>
                  <Button asChild size="sm" variant="outline">
                    <span>Tableaux</span>
                  </Button>
                </Link>
                <Link href={`/costumes?saison=${saison._id}`} passHref>
                  <Button asChild size="sm" variant="outline">
                    <span>Costumes</span>
                  </Button>
                </Link>
                <Link href={`/users?saison=${saison._id}`} passHref>
                  <Button asChild size="sm" variant="outline">
                    <span>Utilisateurs</span>
                  </Button>
                </Link>
              </div>
              <div className="flex justify-end items-center w-full gap-2">
                {!saison.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActivate(saison._id)}
                    disabled={updatePending}
                  >
                    {updatePending ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Activer"
                    )}
                  </Button>
                )}
                <SaisonFormDialog
                  open={open === `edit-${saison._id}`}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpen(`edit-${saison._id}`);
                    } else {
                      setOpen("");
                    }
                  }}
                  editSaison={saison}
                  loading={updatePending}
                  onSave={(values) =>
                    handleUpdate(saison._id as Id<"saison">, values)
                  }
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    disabled={updatePending}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Modifier
                  </Button>
                </SaisonFormDialog>
                <SaisonDeleteDialog
                  open={open === `delete-${saison._id}`}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpen(`delete-${saison._id}`);
                    } else {
                      setOpen("");
                    }
                  }}
                  saisonToDelete={saison}
                  onDelete={() => remove({ id: saison._id as Id<"saison"> })}
                  loading={removePending}
                >
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={removePending}
                    aria-label={`Supprimer la saison ${saison.nom}`}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                  </Button>
                </SaisonDeleteDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
