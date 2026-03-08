import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Costume} from "@/type";
import {Button} from "@/components/ui/button";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useConvexMutation} from "@convex-dev/react-query";
import {toast} from "sonner";
import {api} from "@/convex/_generated/api";
import ImageUploader from "@/components/ui/image-uploader";

const costumeSchema = z.object({
    photo: z.string().url({message: "entrez une url valide"}).optional(),
    descriptif: z.string().optional(),
    sexe: z.string().optional(),
    type: z.string().optional(),
    tissu_motif: z.string().optional(),
    couleur: z.string().optional(),
    taille: z.union([z.string(), z.number()]).optional(),
    quantite: z.number().min(0, {message: "La quantité doit être au moins 0"}).optional(),
    emplacement: z.string().optional(),
    portant: z.coerce.number().optional(),
    divers: z.string().optional(),
});

type CostumeFormValues = z.infer<typeof costumeSchema>;

type Props = {
    costume: Costume;
    onEdit?: (edited : boolean) => void;
};

export default function CostumeEditForm({ costume , onEdit }: Props) {
    const { mutate: updateCostume } = useMutation({
        mutationFn: useConvexMutation(api.costumes.updateCostume),
        onSuccess: () => {
            if (onEdit) {
                onEdit(true);
            }
            // Handle success, e.g., show a notification or redirect
            toast.success(`Costume modifié avec succès !`);
        },
        onError: () => {
            if (onEdit) {
                onEdit(false);
            }
            // Handle error, e.g., show a notification
            toast.error(`Erreur lors de la modification du costume `);
        }
    })

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

    const form = useForm<CostumeFormValues>({
        resolver: zodResolver(costumeSchema),
        mode: "onChange",
        defaultValues: {
            photo: costume.photo ?? "",
            descriptif: costume.descriptif ?? "",
            sexe: costume.sexe ?? "",
            type: costume.type ?? "",
            tissu_motif: costume.tissu_motif ?? "",
            couleur: costume.couleur ?? "",
            taille: costume.taille ?? "",
            quantite: costume.quantite ?? undefined,
            emplacement: costume.emplacement ?? "",
            portant: costume.portant ?? undefined,
            divers: costume.divers ?? "",
        },
    });

    const onSubmit = (data: CostumeFormValues) => {
        updateCostume({ id: costume._id, data });
    };

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Génère l’URL d’upload
        const uploadUrlData =  await generateUploadUrl({});

    

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[400px]  overflow-y-auto space-y-4 p-2">
                <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ImageUploader
                                    id={"photo"}
                                    src={field.value}
                                    onChange={handleInput}
                                    alt={"Photo du costume"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descriptif"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descriptif</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sexe"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sexe</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tissu_motif"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tissu/Motif</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="couleur"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Couleur</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="taille"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Taille</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantite"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantité</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    min={0}
                                    step={1}
                                    value={field.value === undefined || field.value === null ? "" : String(field.value)}
                                    onChange={(e) => {
                                        const v = e.target.value.trim();
                                        if (v === "") {
                                        field.onChange("")      // permet d'effacer totalement
                                        } else if (/^\d+$/.test(v)) {
                                        field.onChange(Number(v));      // convertit seulement si valide
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emplacement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Emplacement</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="portant"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Portant</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="divers"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Divers</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
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