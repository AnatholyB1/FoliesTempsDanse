"use client";
import {DataTable} from "@/components/data-table/data-table";
import {DataTablePagination} from "@/components/data-table/pagination";
import {DataTableViewOptions} from "@/components/data-table/data-table-view-options";
import {Skeleton} from "@/components/ui/skeleton";
import {useDataTable} from "@/components/data-table/data-table-provider";
import {CreateAccessoireDialog} from "@/app/accessoires/dialog";
import {Glasses} from "lucide-react";
import {useState} from "react";

export default function Page() {

    const [open, setOpen] = useState(false);
    const { isPending } = useDataTable();

    return (
        <section className="flex flex-col gap-4 p-6 max-w-6xl mx-auto w-full">
            {/* Page header */}
            <header>
                <h1
                    className="text-2xl font-bold text-foreground flex items-center gap-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    <Glasses className="w-6 h-6 text-primary" />
                    Accessoires
                </h1>
                <div className="flex items-center gap-2 mt-2" aria-hidden>
                    <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                    <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
                    <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                </div>
            </header>

            <DataTableViewOptions>
                <CreateAccessoireDialog
                    open={open}
                    onOpenChange={setOpen}
                    onEdit={(edited) => setOpen(!edited)}
                />
            </DataTableViewOptions>

            <div className="relative">
                {isPending && (
                    <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm pointer-events-none rounded-md">
                        <div className="flex flex-col gap-2 p-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
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