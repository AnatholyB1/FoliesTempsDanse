"use client"

import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import {Settings2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {useDataTable} from "@/components/data-table/data-table-provider";
import {Input} from "@/components/ui/input"


export function DataTableViewOptions<T>( {children}: Readonly<{ children?: React.ReactNode }>  ) {
    const {table} = useDataTable<T>();

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Input
                placeholder="Rechercher..."
                value={table.getState().globalFilter ?? ""}
                onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                }
                className="max-w-xs h-9 text-sm"
            />
            {children}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto h-9 border-border/60 text-muted-foreground hover:text-foreground"
                    >
                        <Settings2 className="w-4 h-4 mr-1.5" />
                        Colonnes
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                        Affichage
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize text-sm"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
