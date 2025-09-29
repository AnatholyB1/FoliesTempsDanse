import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import FormEdit from "@/app/costumes/form-edit";
import React from "react";
import {Costume} from "@/type";
import {toast} from "sonner"
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import FormNew from "@/app/costumes/form-new";

type EditCostumeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    costume: Costume;
    onEdit?: (edited: boolean) => void;
    trigger?: boolean;
};

export function EditCostumeDialog({ open, onOpenChange, costume, onEdit, trigger = false }: EditCostumeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? null : (
                <DialogTrigger asChild>
                    <Button >Modifier</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modification</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du costume. Assurez-vous que toutes les informations sont correctes avant de sauvegarder.
                    </DialogDescription>
                </DialogHeader>
                <FormEdit costume={costume} onEdit={onEdit}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abandonner</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function CreateCostumeDialog({ open, onOpenChange, onEdit, trigger = false }: Omit<EditCostumeDialogProps, "costume">) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? null : (
                <DialogTrigger asChild>
                    <Button >Nouveau</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Création d&apos;un costume</DialogTitle>
                    <DialogDescription>
                        Créez un nouveau costume. Assurez-vous que toutes les informations sont correctes avant de sauvegarder.
                    </DialogDescription>
                </DialogHeader>
                <FormNew onCreated={onEdit}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abandonner</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type DeleteCostumeDialogProps = {
    id: Id<"costumes">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete?: () => void;
    trigger?: boolean;
};

export function DeleteCostumeDialog({id,  open, onOpenChange,onDelete = () => {},  trigger = false }: DeleteCostumeDialogProps) {


    const {mutate: deleteCostume} = useMutation({
        mutationFn: useConvexMutation(api.costumes.deleteCostume),
        onSuccess: () => {
            // Handle success, e.g., show a notification or redirect
            onDelete();
            toast.success(`Costume supprimé avec succès !`);
            onOpenChange(false);
        },
        onError: () => {
            // Handle error, e.g., show a notification
            toast.error(`Erreur lors de la suppression du costume `)
        }

    })

    const handleDelete = () => {
        deleteCostume({ id });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? null : (
                <DialogTrigger asChild>
                    <Button variant="destructive">Supprimer</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Le costume sera définitivement supprimé.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abandonner</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleDelete}>
                        Continuer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}