import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Saison, Tableau} from "@/type";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const tableauSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  saisonId: z.string().min(1, "La saison est requise"),
  description: z.string().optional(),
});

export type TableauFormValues = z.infer<typeof tableauSchema>;

type TableauFormDialogProps = {
  editTableau?: Tableau | null;
  saisons: { _id: string; nom: string }[];
  loading: boolean;
  onSave: (values: TableauFormValues) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TableauFormDialog({
                                    editTableau,
                                    saisons,
                                    loading,
                                    onSave,
                                    children,
                                    open,
                                    onOpenChange,
                                  }: TableauFormDialogProps) {
  const form = useForm<TableauFormValues>({
    resolver: zodResolver(tableauSchema),
    defaultValues: {
      nom: editTableau?.nom ?? "",
      saisonId: editTableau?.saisonId ?? (saisons[0]?._id ?? ""),
      description: editTableau?.description ?? "",
    },
    mode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="animate-fade-in">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-2">
                {editTableau ? "Modifier le tableau" : "Créer un tableau"}
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
                      placeholder="Nom du tableau"
                      className="bg-card text-card-foreground focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="saisonId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="saisonId">Saison</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Choisir une saison"/>
                      </SelectTrigger>
                      <SelectContent>
                        {saisons?.map((saison: Saison) => (
                          <SelectItem
                            key={saison._id}
                            value={saison._id}
                          >
                            {saison.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
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
                  <FormMessage className="text-destructive text-xs" />
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

type TableauDeleteDialogProps = {
  tableauToDelete: Tableau | null;
  onDelete: () => void;
  loading: boolean;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TableauDeleteDialog({
                                      tableauToDelete,
                                      onDelete,
                                      loading,
                                      children,
                                      open,
                                      onOpenChange,
                                    }: TableauDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2 text-destructive">
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment supprimer le tableau{" "}
            <span className="font-bold">{tableauToDelete?.nom}</span> ? Cette action est irréversible.
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