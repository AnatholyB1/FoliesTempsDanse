"use client";
import {Id} from "@/convex/_generated/dataModel";
import NotFound from "next/dist/client/components/not-found-error";

import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {clsx} from "clsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useChoregraphieDetail} from "@/app/choregraphies/[id]/chore-provider";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useSearch} from "@/components/global-search";
import {useEffect} from "react";
import {Danseuse} from "@/type";
import {Label} from "@/components/ui/label"


function ChoreSkeleton() {
    return (
        <div className="max-w-2xl w-full h-full mx-auto py-8">
            <Skeleton className="h-20 w-full rounded-lg animate-pulse"/>
            <div>
                <Skeleton className="h-6 w-3/4 mt-4 rounded-lg animate-pulse"/>
                <Skeleton className="h-4 w-full mt-2 rounded-lg animate-pulse"/>
                <Skeleton className="h-4 w-full mt-2 rounded-lg animate-pulse"/>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 h-64">
                <div>
                    <Skeleton className="h-20 w-3/4 mt-4 rounded-lg animate-pulse"/>
                    <Skeleton className="h-32 w-full mt-4 rounded-lg animate-pulse"/>
                    <Skeleton className="h-32 w-full mt-4 rounded-lg animate-pulse"/>
                </div>
                <Skeleton className="h-full w-full mt-4 rounded-lg animate-pulse"/>
            </div>
        </div>
    );
}

function ChoreHeader() {
    const {
        form,
        setForm,
        updatePending,
        status,
        setDirty,
        tableaux,
        handleUpdate,
        chore
    } = useChoregraphieDetail();
    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-4">
                <CardTitle className="flex-1 space-y-2">
                    <Label>Nom</Label>
                    <Input
                        value={form.nom}
                        onChange={e => {
                            setForm(f => ({...f, nom: e.target.value}));
                            setDirty(true);
                        }}
                        className="text-2xl font-bold"
                        placeholder="Nom de la chorégraphie"
                    />
                </CardTitle>
                <div>
                    <Label>Tableau</Label>
                    <Select
                        value={chore.tableauId}
                        onValueChange={(value) => handleUpdate({
                            id: chore._id,
                            data: {tableauId: value as Id<"tableaux">}
                        })}
                        disabled={updatePending}
                    >

                        <SelectTrigger>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {tableaux?.map((t) => (
                                <SelectItem key={t._id} value={t._id}>
                                    {t.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className={clsx("flex items-center gap-2", status.color)}>
                    {status.icon}
                    <span className="text-xs ">{status.text}</span>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Label>Nom de la musique</Label>
                <Input
                    value={form.musique}
                    onChange={e => {
                        setForm(f => ({...f, musique: e.target.value}));
                        setDirty(true);
                    }}
                    placeholder="Musique"
                />
                <Label>Description</Label>
                <Textarea
                    value={form.description}
                    onChange={e => {
                        setForm(f => ({...f, description: e.target.value}));
                        setDirty(true);
                    }}
                    placeholder="Description"
                />
            </CardContent>
        </Card>
    );
}

function ChoreRoleManagement() {
    const {
        role,
        setSelectedEntity,
        selectedEntity,
        danseuse,
        removeDanseuseFromRole,
        statusRole,
        handleUpdateRole,
        roleName
    } = useChoregraphieDetail()

    const handleRemoveDanseuse = () => {
        removeDanseuseFromRole({roleId: role._id})
        setSelectedEntity("role")
    }


    if (!role && selectedEntity !== "role") {
        return (
            <Button onClick={() => setSelectedEntity("role")}>
                Créer un rôle
            </Button>
        );
    }

    if (!role && selectedEntity === "role") {
        return (
            <div className={"h-full w-full bg-accent rounded-lg border border-primary py-4"}>
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-lg font-semibold">Assigner un danseuse</h3>
                    <Button onClick={() => setSelectedEntity(undefined)} size={"sm"}><X/></Button>
                </div>
            </div>
        );
    }
    return (
        <div className={" w-full border border-primary bg-accent rounded-lg p-6 flex flex-col gap-4 "}>
            <div className={"justify-between flex flex-row"}>
                <h2 className="text-lg font-semibold">Gestion du rôles</h2>
                <div className={clsx("flex items-center gap-2", statusRole.color)}>
                    {statusRole.icon}
                    <span className="text-xs ">{statusRole.text}</span>
                </div>
            </div>
            <Label>Nom du rôle</Label>
            <Input onChange={(e) => handleUpdateRole(e.target.value)} value={roleName}/>
            <Label>Danseuse assignée</Label>
            {role.danseuseId && danseuse ? (
                <div
                    className="flex items-center text-sm justify-between gap-2 px-3 py-2 bg-primary text-accent rounded-lg">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={danseuse.user?.picture}/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>{danseuse.nom}</span>
                    </div>
                    <X className={"h-4 w-4 cursor-pointer"} onClick={handleRemoveDanseuse}/>
                </div>
            ) : (
                <span className={"text-sm italic"}>Assignez une danseuse...</span>
            )}
        </div>
    );


}

function ChoreGroupeManagement() {
    return (
        <div><ChoreRoleManagement/></div>
    )
}

// Gradient vert (safe) -> jaune (moyen) -> rouge (dangereux)
function getDangerColor(score: number, min = 0, max = 6) {
    // Clamp le score
    const s = Math.max(min, Math.min(score, max));
    // Interpolation: 0 = vert, milieu = jaune, max = rouge
    const percent = (s - min) / (max - min);
    let r, g;
    if (percent < 0.5) {
        // Vert -> Jaune
        r = Math.round(255 * (percent * 2));
        g = 200;
    } else {
        // Jaune -> Rouge
        r = 255;
        g = Math.round(200 * (1 - (percent - 0.5) * 2));
    }
    return `rgb(${r},${g},80)`;
}

function ChoreProposition() {
    const {
        selectedEntity,
        danseusesLibres,
        updateRole,
        chore,
        role,
        createRole,
        setSelectedEntity
    } = useChoregraphieDetail()
    const {setData, results: danseuses, setQuery} = useSearch<Danseuse>()


    useEffect(() => {
        if (danseusesLibres) {
            // ranger par score croissant
            danseusesLibres.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
            setData(danseusesLibres)
        }
    }, [danseusesLibres, setData])

    const handleSelectDanseuseForRole = (danseuse: Danseuse) => {
        if (role) {
            updateRole({id: role._id, nom: chore.nom, danseuseId: danseuse._id})
        } else {
            createRole({choregraphieId: chore._id, nom: "", danseuseId: danseuse._id})
        }
        setSelectedEntity(undefined)
    }

    if (selectedEntity === "role") {
        // Chercher min et max score pour le gradient
        const scores = danseuses?.map(d => d.score ?? 0) ?? [];
        const min = Math.min(...scores, 0);
        const max = Math.max(...scores, 6);
        return (
            <div className={" px-4 w-full bg-accent rounded-lg py-4 overflow-y-auto"}>
                <Input className={"sticky top-0 bg-muted mb-2 "}
                       placeholder={"Rechercher une danseuse"}
                       onChange={e => {
                           setQuery(e.target.value)
                       }}
                />
                <div className="grid gap-2">
                    {danseuses?.map(danseuse => (
                        <Button key={danseuse._id} variant={"outline"} className="flex flex-col gap-2 h-auto"
                                onClick={() => handleSelectDanseuseForRole(danseuse)}>
                            <Avatar>
                                <AvatarImage src={danseuse.user?.picture}/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{danseuse.nom}</span>
                            <span
                                className="rounded h-2 w-2  text-xs font-semibold "
                                style={{background: getDangerColor(danseuse.score ?? 0, min, max), color: '#fff'}}
                            >
              </span>
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={"h-full space-y-2 w-full p-4 bg-accent rounded-lg"}>
            <h2 className={"text-xl font-bold"}>Vous pouvez gérer les propositions ici.</h2>
            <p>Sélectionnez un rôle ou un groupe pour voir les options de gestion.</p>
            <p>Sélectionnez une danseuse pour voir les options de costumes et accessoires</p>
        </div>
    )
}


export default function ChoregraphieDetailPage() {

    const {
        chorePending,
        chore,
    } = useChoregraphieDetail()


    if (chorePending) {
        return <ChoreSkeleton/>
    }

    if (!chore) {
        return <NotFound/>
    }

    return (
        <div className="max-w-2xl w-full h-full mx-auto py-8">
            <ChoreHeader/>
            <div className="grid grid-cols-2 gap-4 mt-8 h-80">
                <ChoreGroupeManagement/>
                <ChoreProposition/>
            </div>
        </div>
    );
}