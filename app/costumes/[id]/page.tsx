"use client";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import {Costume} from "@/type";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import React, {use, useEffect, useState} from "react";
import {DeleteCostumeDialog, EditCostumeDialog} from "@/app/costumes/dialog";
import {ArrowLeft, Shirt} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

type Props = {
    params: Promise<{ id: string }>
};

export default function Page({params}: Props) {
    const {id} = use(params);
    const [openEdit, setOpenEdited] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleted, setDeleted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (deleted) {
            router.push("/costumes");
        }
    }, [deleted, router]);

    const costume: Costume | undefined = useQuery(api.costumes.getCostume, {id: id as Id<"costumes">});

    if (costume === undefined || costume === null) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-px w-20 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-80 w-full rounded-xl" />
                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-6 w-full rounded" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <Button variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground" asChild>
                        <Link href="/costumes"><ArrowLeft className="w-4 h-4 mr-1" /> Retour aux costumes</Link>
                    </Button>
                    <h1
                        className="text-3xl font-bold text-foreground flex items-center gap-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        <Shirt className="w-7 h-7 text-primary" />
                        {costume.descriptif || "Costume"}
                    </h1>
                    <div className="flex items-center gap-2 mt-2" aria-hidden>
                        <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                        <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
                        <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                    </div>
                </div>
                <div className="flex gap-2 mt-8">
                    <EditCostumeDialog
                        costume={costume}
                        onEdit={(edited) => setOpenEdited(!edited)}
                        open={openEdit}
                        onOpenChange={setOpenEdited}
                    />
                    <DeleteCostumeDialog
                        id={id as Id<"costumes">}
                        open={openDelete}
                        onOpenChange={setOpenDelete}
                        onDelete={() => setDeleted(true)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Photo */}
                <div className="flex justify-center">
                    <div className="w-full max-w-[360px] rounded-xl shadow-lg bg-muted flex items-center justify-center overflow-hidden">
                        <Image
                            width={360}
                            height={360}
                            src={costume.photo || "/placeholder.jpg"}
                            alt="Photo du costume"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                    {[
                        { label: "Sexe", value: costume.sexe },
                        { label: "Type", value: costume.type },
                        { label: "Tissu / Motif", value: costume.tissu_motif },
                        { label: "Couleur", value: costume.couleur },
                        { label: "Taille", value: costume.taille },
                        { label: "Quantité", value: costume.quantite },
                        { label: "Emplacement", value: costume.emplacement },
                        { label: "Portant", value: costume.portant },
                        { label: "Divers", value: costume.divers },
                    ].map(({ label, value }) =>
                        value ? (
                            <div key={label} className="flex flex-col gap-0.5">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                                <span className="text-sm font-medium text-foreground">{value}</span>
                            </div>
                        ) : null
                    )}
                    <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground space-y-1">
                        <div><span className="font-semibold">ID :</span> {costume._id}</div>
                        <div><span className="font-semibold">Créé le :</span> {new Date(costume._creationTime).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}