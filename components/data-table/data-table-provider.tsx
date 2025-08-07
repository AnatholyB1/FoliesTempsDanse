import {createContext, ReactNode, useContext, useState} from "react";
import {
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from "@tanstack/table-core";
import {ColumnDef, getCoreRowModel, Table, useReactTable} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";
import {convexQuery} from "@convex-dev/react-query";
import {FunctionReference} from "convex/server";
import {EmptyObject} from "convex-helpers";


interface DataTableProviderProps<T> {
    action: FunctionReference<"query", "public", EmptyObject, T, string | undefined>;
    columns: ColumnDef<T>[];
    children: ReactNode;
}

interface DataTableContextType<T> {
    table: Table<T>;
    isPending: boolean;
    error: Error | null;
}

const DataTableContext = createContext<DataTableContextType<unknown> | undefined>(undefined);


function DataTableProvider<T>({
                                           action,
                                           columns,
                                           children,
                                       }: DataTableProviderProps<T>) {


    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });


    const {data, isPending, error} = useQuery(convexQuery(action, {}));

    const items = data as T[] || [] as T[];

    const table = useReactTable({
        data: items,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });


    const contextValue: DataTableContextType<T> = {
        table,
        isPending,
        error: error as Error | null,
    };

    return (
        <DataTableContext.Provider value={contextValue as DataTableContextType<unknown>}>
            {children}
        </DataTableContext.Provider>
    );
}

function useDataTable<T>() {
    const ctx = useContext(DataTableContext) as DataTableContextType<T> | undefined;
    if (!ctx) throw new Error("useDataTable must be used within a DataTableProvider");
    return ctx;
}

export {DataTableProvider, useDataTable};