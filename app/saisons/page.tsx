"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useRef, useEffect } from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Leaf, CheckCircle2, Pencil, Trash2, Loader2 } from "lucide-react";
// import { useQuery, useMutation } from "convex/react"; // à adapter selon ton setup
// import { getSaisons, createSaison, updateSaison, deleteSaison } from "../../convex/saison";

type Saison = {
  _id: string;
  nom: string;
  annee: string;
  description?: string;
  active?: boolean;
};

export default function SaisonsPage() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [saisonToDelete, setSaisonToDelete] = useState<Saison | null>(null);
  // const saisons = useQuery(getSaisons) ?? [];
  // const create = useMutation(createSaison);
  // const update = useMutation(updateSaison);
  // const remove = useMutation(deleteSaison);
  // Simule des données pour le squelette
  const [saisons, setSaisons] = useState<Saison[]>([
    {
      _id: "1",
      nom: "2024-2025",
      annee: "2025",
      description: "Saison actuelle",
      active: true,
    },
    {
      _id: "2",
      nom: "2023-2024",
      annee: "2024",
      description: "Saison précédente",
      active: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editSaison, setEditSaison] = useState<Saison | null>(null);

  // Handlers CRUD (à connecter à Convex)
  const handleActivate = async (id: string) => {
    setLoading(true);
    // await update({ id, active: true });
    setSaisons(saisons.map((s) => ({ ...s, active: s._id === id })));
    setLoading(false);
    toast.success("Saison activée");
  };
  const handleDelete = async () => {
    if (!saisonToDelete) return;
    setLoading(true);
    // await remove({ id: saisonToDelete._id });
    setSaisons(saisons.filter((s) => s._id !== saisonToDelete._id));
    setLoading(false);
    setConfirmDialogOpen(false);
    setSaisonToDelete(null);
    toast.success("Saison supprimée");
  };
  const handleEdit = (saison: Saison) => {
    setEditSaison(saison);
    setOpenDialog(true);
  };
  const handleCreate = () => {
    setEditSaison(null);
    setOpenDialog(true);
  };
  // Zod schema
  const saisonSchema = z.object({
    nom: z.string().min(2, "Le nom est requis"),
    annee: z.string().min(4, "L'année est requise"),
    description: z.string().optional(),
  });

  type SaisonFormValues = z.infer<typeof saisonSchema>;

  const form = useForm<SaisonFormValues>({
    resolver: zodResolver(saisonSchema),
    defaultValues: {
      nom: editSaison?.nom ?? "",
      annee: editSaison?.annee ?? "",
      description: editSaison?.description ?? "",
    },
    mode: "onChange",
  });

  // Focus automatique sur le premier champ
  const nomInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (openDialog && nomInputRef.current) {
      nomInputRef.current.focus();
    }
  }, [openDialog]);

  const handleSave = async (values: SaisonFormValues) => {
    setLoading(true);
    if (editSaison) {
      setSaisons(
        saisons.map((s) =>
          s._id === editSaison._id ? { ...values, _id: editSaison._id } : s
        )
      );
      toast.success("Saison modifiée");
    } else {
      setSaisons([...saisons, { ...values, _id: String(Date.now()) }]);
      toast.success("Saison créée");
    }
    setLoading(false);
    setOpenDialog(false);
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Leaf className="w-7 h-7 text-primary" /> Saisons
        </h1>
        <Button onClick={handleCreate} variant="default">
          Nouvelle saison
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {saisons.map((saison) => (
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
                  <Button asChild size="sm" variant="ghost">
                    <span>Tableaux</span>
                  </Button>
                </Link>
                <Link href={`/costumes?saison=${saison._id}`} passHref>
                  <Button asChild size="sm" variant="ghost">
                    <span>Costumes</span>
                  </Button>
                </Link>
                <Link href={`/utilisateurs?saison=${saison._id}`} passHref>
                  <Button asChild size="sm" variant="ghost">
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
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Activer"
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(saison)}
                  disabled={loading}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSaisonToDelete(saison);
                    setConfirmDialogOpen(true);
                  }}
                  disabled={loading}
                  aria-label={`Supprimer la saison ${saison.nom}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          aria-modal="true"
          role="dialog"
          className="animate-fade-in"
        >
          {/* Formulaire de création/édition de saison */}
          <Form
            {...form}
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-4"
            aria-label="Formulaire saison"
          >
            <h2 className="text-xl font-semibold mb-2">
              {editSaison ? "Modifier la saison" : "Créer une saison"}
            </h2>
            <FormField
              name="nom"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="nom">Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="nom"
                      ref={nomInputRef}
                      placeholder="Nom de la saison"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                      aria-invalid={!!fieldState.error}
                      aria-describedby="nom-error"
                    />
                  </FormControl>
                  <FormMessage
                    id="nom-error"
                    className="text-destructive text-xs"
                  />
                </FormItem>
              )}
            />
            <FormField
              name="annee"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="annee">Année</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="annee"
                      placeholder="Année"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                      aria-invalid={!!fieldState.error}
                      aria-describedby="annee-error"
                    />
                  </FormControl>
                  <FormMessage
                    id="annee-error"
                    className="text-destructive text-xs"
                  />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="description"
                      placeholder="Description"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                      aria-invalid={!!fieldState.error}
                      aria-describedby="description-error"
                    />
                  </FormControl>
                  <FormMessage
                    id="description-error"
                    className="text-destructive text-xs"
                  />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenDialog(false)}
                aria-label="Annuler"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                aria-label="Enregistrer"
                tabIndex={0}
                style={{ boxShadow: "0 0 0 2px var(--primary)" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent
          aria-modal="true"
          role="alertdialog"
          className="animate-fade-in"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-destructive">
              Confirmer la suppression
            </h2>
            <p>
              Voulez-vous vraiment supprimer la saison{" "}
              <span className="font-bold">{saisonToDelete?.nom}</span> ? Cette
              action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmDialogOpen(false)}
                aria-label="Annuler"
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                aria-label="Confirmer la suppression"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Supprimer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
