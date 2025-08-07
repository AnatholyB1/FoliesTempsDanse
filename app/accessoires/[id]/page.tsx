"use client";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Accessoire} from "@/type";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import React, {use} from "react";
import {DeleteAccessoireDialog, EditAccessoireDialog} from "@/app/accessoires/dialog";
import {useRouter} from "next/navigation";

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
            <Card className="max-w-md mx-auto py-5 my-3">
                <CardHeader>
                    <CardTitle>Chargement de l&apos;accessoire...</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-[300px] mb-4" />
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto py-5 my-3">
            <CardHeader>
                <CardTitle>Accessoire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 ">
                    <Image
                        width={200}
                        height={200}
                        src={accessoire.photo || "/placeholder.jpg"}
                        alt="Photo de l'accessoire"
                        className=" h-[200px] w-[200px] object-cover rounded mb-4 drop-shadow-lg place-self-center"
                    />
                <div><span className="font-semibold">Descriptif :</span> {accessoire.descriptif}</div>
                <div><span className="font-semibold">Sexe :</span> {accessoire.sexe}</div>
                <div><span className="font-semibold">Type :</span> {accessoire.type}</div>
                <div><span className="font-semibold">Tissu/Motif :</span> {accessoire.tissu_motif}</div>
                <div><span className="font-semibold">Couleur :</span> {accessoire.couleur}</div>
                <div><span className="font-semibold">Taille :</span> {accessoire.taille}</div>
                <div><span className="font-semibold">Quantité :</span> {accessoire.quantite}</div>
                <div><span className="font-semibold">Divers :</span> {accessoire.divers}</div>
                <div><span className="font-semibold">Portant :</span> {accessoire.portant}</div>
                <div><span className="font-semibold">Photo prise par :</span> {accessoire.photo_prise_par}</div>
            </CardContent>
            <CardFooter className="flex flex-col justify-between gap-2 flex-grow">
                <div className="text-xs text-gray-500 place-self-start ">
                    <span className="font-semibold">ID :</span> {accessoire._id}<br />
                    <span className="font-semibold">Créé le :</span> {new Date(accessoire._creationTime).toLocaleString()}
                </div>
                <div className="text-xs flex flex-row gap-2">
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
            </CardFooter>
        </Card>
    );
}