import React from "react";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Saison } from "@/type";

const saisonSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  annee: z.string().min(4, "L'année est requise"),
  description: z.string().optional(),
});

export type SaisonFormValues = z.infer<typeof saisonSchema>;

type SaisonFormDialogProps = {
  editSaison?: Saison | null;
  loading: boolean;
  onSave: (values: SaisonFormValues) => void;
  children?: React.ReactNode;
};

export function SaisonFormDialog({
  editSaison,
  loading,
  onSave,
  children,
}: SaisonFormDialogProps) {
  // Zod schema

  const form = useForm<SaisonFormValues>({
    resolver: zodResolver(saisonSchema),
    defaultValues: {
      nom: editSaison?.nom ?? "",
      annee: editSaison?.annee ?? "",
      description: editSaison?.description ?? "",
    },
    mode: "onChange",
  });

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="animate-fade-in">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-2">
                {editSaison ? "Modifier la saison" : "Créer une saison"}
              </DialogTitle>
            </DialogHeader>
            <FormField
              name="nom"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nom">Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="nom"
                      placeholder="Nom de la saison"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="annee">Année</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="annee"
                      placeholder="Année"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="description"
                      placeholder="Description"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage
                    id="description-error"
                    className="text-destructive text-xs"
                  />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                onClick={form.handleSubmit(onSave)}
                style={{ boxShadow: "0 0 0 2px var(--primary)" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

type SaisonDeleteDialogProps = {
  saisonToDelete: Saison | null;
  onDelete: () => void;
  loading: boolean;
  children?: React.ReactNode;
};

export function SaisonDeleteDialog({
  saisonToDelete,
  onDelete,
  loading,
  children,
}: SaisonDeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2 text-destructive">
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment supprimer la saison{" "}
            <span className="font-bold">{saisonToDelete?.nom}</span> ? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
