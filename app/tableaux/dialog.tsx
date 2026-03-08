import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
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
import {Choregraphie, Tableau} from "@/type";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const choregraphieSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  blocId: z.string().min(1, "Le bloc est requis"),
  musique: z.string().optional(),
  duree: z.coerce.number().optional(),
  description: z.string().optional(),
});

export type ChoregraphieFormValues = z.infer<typeof choregraphieSchema>;

type ChoregraphieFormDialogProps = {
  editChoregraphie?: Choregraphie | null;
  loading: boolean;
  onSave: (values: ChoregraphieFormValues) => void;
  tableaux: Tableau[];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ChoregraphieFormDialog({
                                         editChoregraphie,
                                         loading,
                                         onSave,
                                         tableaux,
                                         children,
                                         open,
                                         onOpenChange,
                                       }: ChoregraphieFormDialogProps) {
  const form = useForm<ChoregraphieFormValues>({
    resolver: zodResolver(choregraphieSchema),
    defaultValues: {
      nom: editChoregraphie?.nom ?? "",
      blocId: editChoregraphie?.blocId ?? (tableaux[0]?._id ?? ""),
      musique: editChoregraphie?.musique ?? "",
      duree: editChoregraphie?.duree ?? undefined,
      description: editChoregraphie?.description ?? "",
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
                {editChoregraphie ? "Modifier le tableau" : "Créer un tableau"}
              </DialogTitle>
            </DialogHeader>
            <FormField
              name="nom"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="nom">Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="nom"
                      placeholder="Nom du tableau"
                      className="bg-card text-card-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs"/>
                </FormItem>
              )}
            />
            <FormField
              name="blocId"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="blocId">Bloc</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger id="blocId" className="w-full bg-card text-card-foreground">
                        <SelectValue placeholder="Sélectionner un bloc"/>
                      </SelectTrigger>
                      <SelectContent>
                        {tableaux.map((t) => (
                          <SelectItem key={t._id} value={t._id}>
                            {t.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-destructive text-xs"/>
                </FormItem>
              )}
            />
            <FormField
              name="musique"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="musique">Musique</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="musique"
                      placeholder="Musique"
                      className="bg-card text-card-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs"/>
                </FormItem>
              )}
            />
            <FormField
              name="duree"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="duree">Durée (en secondes)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="duree"
                      type="number"
                      placeholder="Durée"
                      className="bg-card text-card-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs"/>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="description"
                      placeholder="Description"
                      className="bg-card text-card-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs"/>
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
                style={{boxShadow: "0 0 0 2px var(--primary)"}}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4"/>
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

type ChoregraphieDeleteDialogProps = {
  choregraphieToDelete: Choregraphie | null;
  onDelete: () => void;
  loading: boolean;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ChoregraphieDeleteDialog({
                                           choregraphieToDelete,
                                           onDelete,
                                           loading,
                                           children,
                                           open,
                                           onOpenChange,
                                         }: ChoregraphieDeleteDialogProps) {
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
            <span className="font-bold">{choregraphieToDelete?.nom}</span> ? Cette
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
              <Loader2 className="animate-spin w-4 h-4"/>
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}