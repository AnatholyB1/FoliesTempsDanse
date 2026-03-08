"use client";
import {Skeleton} from "@/components/ui/skeleton";
import {Accessoire} from "@/type";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import React, {use} from "react";
import {DeleteAccessoireDialog, EditAccessoireDialog} from "@/app/accessoires/dialog";
import {useRouter} from "next/navigation";
import {ArrowLeft, Glasses} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

type Props = {
    params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
    const { id } = use(params);
    const [openEdit, setOpenEdited] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    const accessoire: Accessoire | undefined = useQuery(api.accessoires.getAccessoire, { id: id as Id<"accessoires"> });

    const router = useRouter();

    React.useEffect(() => {
        if (deleted) {
            router.push("/accessoires");
        }
    }, [deleted, router]);

    if (accessoire === undefined || accessoire === null) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Skeleton className="h-8 w-48 mb-2" />
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
                        <Link href="/accessoires"><ArrowLeft className="w-4 h-4 mr-1" /> Retour aux accessoires</Link>
                    </Button>
                    <h1
                        className="text-3xl font-bold text-foreground flex items-center gap-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        <Glasses className="w-7 h-7 text-primary" />
                        {accessoire.descriptif || "Accessoire"}
                    </h1>
                    <div className="flex items-center gap-2 mt-2" aria-hidden>
                        <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                        <span className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
                        <span className="h-px w-10 rounded-full" style={{ background: "var(--gold)" }} />
                    </div>
                </div>
                <div className="flex gap-2 mt-8">
                    <EditAccessoireDialog
                        accessoire={accessoire}
                        onEdit={(edited) => setOpenEdited(!edited)}
                        open={openEdit}
                        onOpenChange={setOpenEdited}
                    />
                    <DeleteAccessoireDialog
                        id={id as Id<"accessoires">}
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
                            src={accessoire.photo || "/placeholder.jpg"}
                            alt="Photo de l'accessoire"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                    {[
                        { label: "Sexe", value: accessoire.sexe },
                        { label: "Type", value: accessoire.type },
                        { label: "Tissu / Motif", value: accessoire.tissu_motif },
                        { label: "Couleur", value: accessoire.couleur },
                        { label: "Taille", value: accessoire.taille },
                        { label: "Quantité", value: accessoire.quantite },
                        { label: "Divers", value: accessoire.divers },
                        { label: "Portant", value: accessoire.portant },
                        { label: "Photo prise par", value: accessoire.photo_prise_par },
                    ].map(({ label, value }) =>
                        value ? (
                            <div key={label} className="flex flex-col gap-0.5">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                                <span className="text-sm font-medium text-foreground">{value}</span>
                            </div>
                        ) : null
                    )}
                    <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground space-y-1">
                        <div><span className="font-semibold">ID :</span> {accessoire._id}</div>
                        <div><span className="font-semibold">Créé le :</span> {new Date(accessoire._creationTime).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}