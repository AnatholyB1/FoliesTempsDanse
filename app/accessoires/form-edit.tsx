import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {toast} from "sonner";
import {api} from "@/convex/_generated/api";
import {Accessoire} from "@/type";
import ImageUploader from "@/components/ui/image-uploader";

const accessoireSchema = z.object({
    photo: z.string().url({message: "Sélectionner une photo"}).optional(),
    descriptif: z.string().optional(),
    sexe: z.string().optional(),
    type: z.string().optional(),
    tissu_motif: z.string().optional(),
    couleur: z.string().optional(),
    taille: z.union([z.string(), z.number()]).optional(),
    quantite: z.number().optional(),
    divers: z.string().optional(),
    portant: z.coerce.number().optional(),
    photo_prise_par: z.string().optional(),
});

type AccessoireFormValues = z.infer<typeof accessoireSchema>;

type Props = {
    accessoire: Accessoire;
    onEdit?: (edited: boolean) => void;
};

export default function AccessoireEditForm({accessoire, onEdit}: Props) {
    const {mutate: updateAccessoire} = useMutation({
        mutationFn: useConvexMutation(api.accessoires.updateAccessoire),
        onSuccess: () => {
            if (onEdit) onEdit(true);
            toast.success("Accessoire modifié avec succès !");
        },
        onError: () => {
            if (onEdit) onEdit(false);
            toast.error("Erreur lors de la modification de l'accessoire");
        }
    });

    const {mutateAsync: getStorageUrl} = useMutation({
        mutationFn: useConvexMutation(api.file.getStorageUrl),
        onSuccess: (data: { url: string | null }) => {
            const uploadUrl = data.url;
            if (uploadUrl) {
                form.setValue("photo", uploadUrl);
            } else {
                toast.error("Aucune URL de stockage trouvée");
            }
        },
        onError: () => {
            toast.error("Erreur lors de la récupération de l'URL de stockage");
        }
    });
    const {mutateAsync: generateUploadUrl} = useMutation({
        mutationFn: useConvexMutation(api.file.generateUploadUrl),
        onError: () => {
            toast.error("Erreur lors de la génération de l'URL de téléchargement");
        }
    });

    const form = useForm<AccessoireFormValues>({
        resolver: zodResolver(accessoireSchema),
        mode: "onChange",
        defaultValues: {
            photo: accessoire.photo ?? "",
            descriptif: accessoire.descriptif ?? "",
            sexe: accessoire.sexe ?? "",
            type: accessoire.type ?? "",
            tissu_motif: accessoire.tissu_motif ?? "",
            couleur: accessoire.couleur ?? "",
            taille: accessoire.taille ?? "",
            quantite: accessoire.quantite ?? "",
            divers: accessoire.divers ?? "",
            portant: accessoire.portant ?? undefined,
            photo_prise_par: accessoire.photo_prise_par ?? "",
        },
    });

    const onSubmit = (data: AccessoireFormValues) => {
        updateAccessoire({id: accessoire._id, data});
    };

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Génère l’URL d’upload
        const uploadUrlData =  await generateUploadUrl({});

        console.log(uploadUrlData);

        // 2. Upload du fichier
        const uploadUrl = uploadUrlData?.uploadUrl;
        if (!uploadUrl) {
            toast.error("Aucune URL d'upload générée");
            return;
        }
        const res = await fetch(uploadUrl, {
            method: "POST",
            body: file,
        });
        const {storageId} = await res.json();
        if (!storageId) {
            toast.error("Erreur lors de l'upload de l'image");
            return;
        }

        // 3. Récupère l'URL publique du fichier uploadé
        await getStorageUrl({storageId});
        toast.success("Image uploadée !");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[400px] overflow-y-auto space-y-4 p-2">
                <FormField
                    control={form.control}
                    name="photo"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <ImageUploader
                                    id={"photo"}
                                    src={field.value}
                                    onChange={handleInput}
                                    alt={"Photo de l'accessoire"}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descriptif"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Descriptif</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sexe"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Sexe</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tissu_motif"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Tissu/Motif</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="couleur"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Couleur</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="taille"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Taille</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantite"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Quantité</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="divers"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Divers</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="portant"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Portant</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="photo_prise_par"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Photo prise par</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className=" absolute bottom-6 ">
                    Enregistrer
                </Button>
            </form>
        </Form>
    );
}