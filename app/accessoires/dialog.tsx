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
import FormEdit from "@/app/accessoires/form-edit";
import React from "react";
import {Accessoire} from "@/type";
import {toast} from "sonner"
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import FormNew from "@/app/accessoires/form-new";

type EditAccessoireDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accessoire: Accessoire;
    onEdit?: (edited: boolean) => void;
    trigger?: boolean;
};

export function EditAccessoireDialog({ open, onOpenChange, accessoire, onEdit, trigger = false }: EditAccessoireDialogProps) {
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
                        Modifiez les informations de l&apos;accessoire. Assurez-vous que toutes les informations sont correctes avant de sauvegarder.
                    </DialogDescription>
                </DialogHeader>
                <FormEdit accessoire={accessoire} onEdit={onEdit}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abandonner</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



export function CreateAccessoireDialog({ open, onOpenChange, onEdit, trigger = false }: Omit<EditAccessoireDialogProps, "accessoire">) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? null : (
                <DialogTrigger asChild>
                    <Button className={"hover:pointer-coarse"}>Nouveau</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Création d&apos;un accessoire</DialogTitle>
                    <DialogDescription>
                        Créez un nouvel accessoire. Assurez-vous que toutes les informations sont correctes avant de sauvegarder.
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

type DeleteAccessoireDialogProps = {
    id: Id<"accessoires">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete?: () => void;
    trigger?: boolean;
};

export function DeleteAccessoireDialog({id,  open, onOpenChange,onDelete = () => {},  trigger = false }: DeleteAccessoireDialogProps) {


    const {mutate: deleteAccessoire} = useMutation({
        mutationFn: useConvexMutation(api.accessoires.deleteAccessoire),
        onSuccess: () => {
            // Handle success, e.g., show a notification or redirect
            toast.success(`Accessoire supprimé avec succès !`);
            onDelete();
            onOpenChange(false);
        },
        onError: () => {
            // Handle error, e.g., show a notification
            toast.error(`Erreur lors de la suppression de l'accessoire `)
        }

    })

    const handleDelete = () => {
        deleteAccessoire({ id });
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
                        Cette action est irréversible. L&apos;accessoire sera définitivement supprimé.
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