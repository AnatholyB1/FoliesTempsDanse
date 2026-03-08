"use client";
import {DataTable} from "@/components/data-table/data-table";
import {DataTablePagination} from "@/components/data-table/pagination";
import {DataTableViewOptions} from "@/components/data-table/data-table-view-options";
import {useDataTable} from "@/components/data-table/data-table-provider";
import {Skeleton} from "@/components/ui/skeleton";
import {CreateCostumeDialog} from "@/app/costumes/dialog";
import {Shirt} from "lucide-react";
import {useState} from "react";


export default function Page() {
    const [open, setOpen] = useState(false);
    const { isPending } = useDataTable();

    if (isPending) {
        return (
            <section className="flex flex-col gap-4 p-6 max-w-6xl mx-auto w-full">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-px w-20" />
                <div className="flex gap-2 mt-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <Skeleton className="h-64 w-full rounded-md mt-2" />
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-4 p-6 max-w-6xl mx-auto w-full">
            {/* Page header */}
            <header>
                <h1
                    className="text-2xl font-bold text-foreground flex items-center gap-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    <Shirt className="w-6 h-6 text-primary" />
                    Costumes
                </h1>
                <div className="flex items-center gap-2 mt-2" aria-hidden>
                    <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                    <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
                    <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                </div>
            </header>

            <DataTableViewOptions>
                <CreateCostumeDialog open={open} onOpenChange={setOpen} onEdit={(edited) => setOpen(!edited)} />
            </DataTableViewOptions>
            <DataTable />
            <DataTablePagination />
        </section>
    )
}