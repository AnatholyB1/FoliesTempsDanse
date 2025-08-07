"use client";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Costume} from "@/type";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import React, {use, useEffect, useState} from "react";
import {DeleteCostumeDialog, EditCostumeDialog} from "@/app/costumes/dialog";

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


    if (costume === undefined  || costume === null) {
        return (
            <Card className="max-w-md mx-auto py-5 my-3">
                <CardHeader>
                    <CardTitle>Chargement du costume...</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-[300px] mb-4"/>
                    <Skeleton className="h-6 w-2/3 mb-2"/>
                    <Skeleton className="h-6 w-1/2 mb-2"/>
                    <Skeleton className="h-6 w-1/3"/>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto py-5 my-3">
            <CardHeader>
                <CardTitle>Costume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                    <Image
                        width={200}
                        height={200}
                        src={costume.photo || "/placeholder.jpg"}
                        alt="Photo du costume"
                        className="w-[200px] h-[200px] place-self-center drop-shadow-lg object-cover rounded mb-4"
                    />
                <div><span className="font-semibold">Descriptif :</span> {costume.descriptif}</div>
                <div><span className="font-semibold">Sexe :</span> {costume.sexe}</div>
                <div><span className="font-semibold">Type :</span> {costume.type}</div>
                <div><span className="font-semibold">Tissu/Motif :</span> {costume.tissu_motif}</div>
                <div><span className="font-semibold">Couleur :</span> {costume.couleur}</div>
                <div><span className="font-semibold">Taille :</span> {costume.taille}</div>
                <div><span className="font-semibold">Quantité :</span> {costume.quantite}</div>
                <div><span className="font-semibold">Emplacement :</span> {costume.emplacement}</div>
                <div><span className="font-semibold">Portant :</span> {costume.portant}</div>
                <div><span className="font-semibold">Photo prise par :</span> {costume.photo_prise_par}</div>

            </CardContent>
            <CardFooter className="flex flex-col justify-between gap-2 flex-grow">
                <div className="text-xs text-gray-500 place-self-start ">
                    <span className="font-semibold">ID :</span> {costume._id}<br/>
                    <span className="font-semibold">Créé le :</span> {new Date(costume._creationTime).toLocaleString()}
                </div>
                <div className="text-xs flex flex-row gap-2">
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
            </CardFooter>
        </Card>
    )
}