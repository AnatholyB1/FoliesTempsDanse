"use client"
import {DataTableProvider} from "@/components/data-table/data-table-provider";
import {api} from "@/convex/_generated/api";
import {columns} from "@/app/costumes/columns";

export default function Layout({
                                   children,
                               }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DataTableProvider action={api.costumes.getCostumes} columns={columns} >
            {children}
        </DataTableProvider>
    );
}