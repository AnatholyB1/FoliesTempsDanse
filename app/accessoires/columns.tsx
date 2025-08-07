import {ColumnDef} from "@tanstack/react-table";

import {MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Accessoire} from "@/type";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {DeleteAccessoireDialog, EditAccessoireDialog} from "@/app/accessoires/dialog";


export const columns: ColumnDef<Accessoire>[] = [
    {
        accessorKey: "photo",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Photo"}/>
        ),
        cell: ({row}) => {
            const accessoire = row.original;
            return (
                <div className="flex items-center justify-center">
                        <Image
                            width={30}
                            height={30}
                            src={accessoire.photo || "/placeholder.jpg"}
                            alt="Accessoire"
                            className="rounded-full h-[30px] object-cover"/>
                </div>
            );
        }
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
        accessorKey: "divers",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Divers"/>
        ),
    },
    {
        accessorKey: "portant",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Portant"/>
        ),
    },
    {
        accessorKey: "photo_prise_par",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Photo prise par"/>
        ),
    },
    {
        id: "actions",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Actions"/>
        ),
        cell: ({row}) => <AccessoireActionsCell accessoire={row.original} />
    },
];


function AccessoireActionsCell({ accessoire }: { accessoire: Accessoire }) {
    const [openModif, setOpenModif] = React.useState(false);
    const [openSuppr, setOpenSuppr] = React.useState(false);

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
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(accessoire._id)}>
                        {"Copier l'ID"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Link href={`/accessoires/${accessoire._id}`}>Voir</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenModif(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSuppr(true)}>Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditAccessoireDialog
                trigger
                accessoire={accessoire}
                onEdit={(edited) => setOpenModif(!edited)}
                open={openModif}
                onOpenChange={setOpenModif}
            />
            <DeleteAccessoireDialog
                trigger
                id={accessoire._id}
                open={openSuppr}
                onOpenChange={setOpenSuppr}
            />
        </>
    );
}

