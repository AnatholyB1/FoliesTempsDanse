"use client"
import {DataTableProvider} from "@/components/data-table/data-table-provider";
import {api} from "@/convex/_generated/api";
import {columns} from "@/app/accessoires/columns";

export default function Layout({
                                   children,
                               }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DataTableProvider action={api.accessoires.getAccessoires} columns={columns} >
            {children}
        </DataTableProvider>
    );
}