import {ColumnDef} from "@tanstack/react-table";
import {Copy, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Costume} from "@/type";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {DeleteCostumeDialog, EditCostumeDialog} from "@/app/costumes/dialog";
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";


export const columns: ColumnDef<Costume>[] = [
    {
        accessorKey: "photo",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Photo"/>
        ),
        cell: ({row}) => {
            const costume = row.original;
            return (
                <div className="flex justify-center items-center">
                        <Image
                            width={30}
                            height={30}
                            src={costume.photo || "/placeholder.jpg"}
                            alt="Costume"
                            className="rounded-full h-[30px] object-cover"
                        />
                </div>
            );
        },
    },
    {
        accessorKey: "descriptif",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Descriptif"/>
        ),
    },
    {
        accessorKey: "sexe",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Sexe"/>
        ),
    },
    {
        accessorKey: "type",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Type"/>
        ),
    },
    {
        accessorKey: "tissu_motif",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Tissu/Motif"/>
        ),
    },
    {
        accessorKey: "couleur",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Couleur"/>
        ),
    },
    {
        accessorKey: "taille",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Taille"/>
        ),
    },
    {
        accessorKey: "quantite",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Quantité"/>
        ),
    },
    {
        accessorKey: "emplacement",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Emplacement"/>
        ),
    },
    {
        accessorKey: "portant",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Portant"/>
        ),
    },
    {
        accessorKey: "divers",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Divers"/>
        ),
    },
    {
        id: "actions",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Actions"/>
        ),
        cell: ({row}) => <CostumeActionsCell costume={row.original} />,
    },
];


function CostumeActionsCell({ costume }: { costume: Costume }) {
    const [openModif, setOpenModif] = React.useState(false);
    const [openSuppr, setOpenSuppr] = React.useState(false);
    const { mutate: duplicate, isPending: duplicatePending } = useMutation({
        mutationFn: useConvexMutation(api.costumes.duplicateCostume),
        onSuccess: () => toast.success("Costume dupliqué"),
        onError: () => toast.error("Erreur lors de la duplication"),
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(costume._id)}>
                        {"Copier l'ID"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Link href={`/costumes/${costume._id}`}>Voir</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenModif(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => duplicate({ id: costume._id })}
                        disabled={duplicatePending}
                        className="gap-2"
                    >
                        <Copy className="w-3.5 h-3.5" /> Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setOpenSuppr(true)} className="text-destructive focus:text-destructive">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditCostumeDialog
                trigger
                costume={costume}
                onEdit={(edited) => setOpenModif(!edited)}
                open={openModif}
                onOpenChange={setOpenModif}
            />
            <DeleteCostumeDialog
                trigger
                id={costume._id}
                open={openSuppr}
                onOpenChange={setOpenSuppr}
            />
        </>
    );
}

