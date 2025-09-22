"use client";
import {DataTable} from "@/components/data-table/data-table";
import {DataTablePagination} from "@/components/data-table/pagination";
import {DataTableViewOptions} from "@/components/data-table/data-table-view-options";
import {Skeleton} from "@/components/ui/skeleton";
import {useDataTable} from "@/components/data-table/data-table-provider";
import {CreateAccessoireDialog} from "@/app/accessoires/dialog";
import {useState} from "react";

export default function Page() {

    const [open, setOpen] = useState(false);

    const { isPending } = useDataTable();


    return (
        <section className="flex  flex-col gap-2 p-4">
                <DataTableViewOptions >
                    <CreateAccessoireDialog
                        open={open}
                        onOpenChange={setOpen}
                        onEdit={(edited) => setOpen(!edited)}
                    />
                </DataTableViewOptions>
                 <div className="relative">
                        {/* Overlay de chargement, sans démonter le tableau */}
                        {isPending && (
                        <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm pointer-events-none">
                            <div className="flex flex-col gap-2 p-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-64 w-full" />
                            </div>
                        </div>
                        )}
                    <DataTable aria-busy={isPending} />
                    <DataTablePagination />
                </div>
        </section>
    )
}