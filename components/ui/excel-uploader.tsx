"use client"
import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Progress} from "@/components/ui/progress";
import {toast} from "sonner";
import {parseExcelBuffer} from "@/function/helper";
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";

export default function ExcelUploader() {
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);

    const { mutateAsync: createAccessoire } = useMutation({
        mutationFn: useConvexMutation(api.accessoires.createAccessoire),
    });
    const { mutateAsync: createCostume } = useMutation({
        mutationFn: useConvexMutation(api.costumes.createCostume),
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return toast.error("Aucun fichier sélectionné");
            const arrayBuffer = await file.arrayBuffer();
            const { costumes, accessoires } = parseExcelBuffer(arrayBuffer);

            const all = [...costumes, ...accessoires];
            setTotal(all.length);
            setProgress(0);
            setOpen(true);

            let created = 0;
            await Promise.all([
                ...costumes.map(async (c) => {
                    await createCostume(c);
                    setProgress(++created);
                }),
                ...accessoires.map(async (a) => {
                    await createAccessoire(a);
                    setProgress(++created);
                }),
            ]);

            setOpen(false);
            toast.success("Import terminé !");
        } catch (error) {
            setOpen(false);
            console.error(error); 
            toast.error("Erreur lors de l'import");
        }
    };

    return (
        <>
            <label htmlFor="excel-upload" className="hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
h-9 px-4 py-2 has-[>svg]:px-3">Importer le fichier Excel</label>
            <input id="excel-upload" type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleFileChange} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>
                        Importation en cours
                    </DialogTitle>
                    <div className="mb-2">Import en cours : {progress} / {total}</div>
                    <Progress value={total ? (progress / total) * 100 : 0} />
                </DialogContent>
            </Dialog>
        </>
    );
}