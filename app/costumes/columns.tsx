import {ColumnDef} from "@tanstack/react-table";
import {MoreHorizontal} from "lucide-react";
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
        cell: ({row}) => <CostumeActionsCell costume={row.original} />,
    },
];


function CostumeActionsCell({ costume }: { costume: Costume }) {
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
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(costume._id)}>
                        {"Copier l'ID"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Link href={`/costumes/${costume._id}`}>Voir</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenModif(true)}>Modifier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSuppr(true)}>Supprimer</DropdownMenuItem>
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

