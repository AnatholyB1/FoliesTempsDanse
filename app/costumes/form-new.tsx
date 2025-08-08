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
import ImageUploader from "@/components/ui/image-uploader";
import type {CreateCostume} from "@/type";

const costumeSchema = z.object({
    photo: z.string().url({ message: "Sélectionner une photo" }).optional(),
    descriptif: z.string().optional(),
    sexe: z.string().optional(),
    type: z.string().optional(),
    tissu_motif: z.string().optional(),
    couleur: z.string().optional(),
    taille: z.union([z.string(), z.number()]).optional(),
    quantite: z.union([z.string(), z.number()]).optional(),
    emplacement: z.string().optional(),
    portant: z.coerce.number().optional(),
    photo_prise_par: z.string().optional(),
});

type CostumeFormValues = z.infer<typeof costumeSchema>;

type Props = {
    onCreated?: (created: boolean) => void;
    onClose?: () => void;
};

export default function CostumeNewForm({ onCreated, onClose }: Props) {
    const { mutate: createCostume, isPending } = useMutation({
        mutationFn: useConvexMutation(api.costumes.createCostume),
        onSuccess: () => {
            toast.success("Costume créé avec succès !");
            if (onCreated) onCreated(true);
            if (onClose) onClose();
        },
        onError: () => {
            toast.error("Erreur lors de la création du costume");
            if (onCreated) onCreated(false);
        }
    });

    const { mutateAsync: getStorageUrl } = useMutation({
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

    const { mutateAsync: generateUploadUrl } = useMutation({
        mutationFn: useConvexMutation(api.file.generateUploadUrl),
        onError: () => {
            toast.error("Erreur lors de la génération de l'URL de téléchargement");
        }
    });

    const form = useForm<CostumeFormValues>({
        resolver: zodResolver(costumeSchema),
        mode: "onChange",
        defaultValues: {
            photo: "",
            descriptif: "",
            sexe: "",
            type: "",
            tissu_motif: "",
            couleur: "",
            taille: "",
            quantite: "",
            emplacement: "",
            portant: undefined,
            photo_prise_par: "",
        },
    });

    const onSubmit = (data: CostumeFormValues) => {
        createCostume(data as CreateCostume);
    };

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadUrlData = await generateUploadUrl({});
        const uploadUrl = uploadUrlData?.uploadUrl;
        if (!uploadUrl) {
            toast.error("Aucune URL d'upload générée");
            return;
        }
        const res = await fetch(uploadUrl, {
            method: "POST",
            body: file,
        });
        const { storageId } = await res.json();
        if (!storageId) {
            toast.error("Erreur lors de l'upload de l'image");
            return;
        }
        await getStorageUrl({ storageId });
        toast.success("Image uploadée !");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-h-[70vh] overflow-y-auto space-y-4 p-4 "
                autoComplete="off"
            >
                <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Photo</FormLabel>
                            <FormControl>
                                <ImageUploader
                                    id="photo"
                                    src={field.value}
                                    onChange={handleInput}
                                    alt="Photo du costume"
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
                                <Input {...field} placeholder="Description courte" />
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
                                <Input {...field} placeholder="Femme, Homme, Mixte..." />
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
                                <Input {...field} placeholder="Type de costume" />
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
                                <Input {...field} placeholder="Tissu ou motif" />
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
                                <Input {...field} placeholder="Couleur principale" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="taille"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Taille</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Taille" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quantite"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Quantité</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nombre" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="emplacement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Emplacement</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Emplacement (salle, armoire...)" />
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
                                <Input type="number" {...field} placeholder="N° portant" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="photo_prise_par"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Photo prise par</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nom du photographe" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    <Button className={"absolute bottom-6"} type="submit" disabled={isPending}>
                        {isPending ? "Enregistrement..." : "Nouveau"}
                    </Button>
            </form>
        </Form>
    );
}