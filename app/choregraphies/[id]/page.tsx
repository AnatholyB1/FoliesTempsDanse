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
import {useEffect, useState} from "react";
import {Accessoire, Costume, Danseuse} from "@/type";
import {Label} from "@/components/ui/label"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";


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


    if (!role && selectedEntity !== "role" && typeof selectedEntity === "undefined") {
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
                    <h3 className="text-lg font-semibold">Assigner une danseuse</h3>
                    <Button onClick={() => setSelectedEntity(undefined)} size={"sm"}><X/></Button>
                </div>
            </div>
        );
    }

    if (role && selectedEntity !== "role") {
        return <Button onClick={() => setSelectedEntity("role")}>Modifier le rôle</Button>;
    }

    return (
        <div className={" w-full border border-primary bg-accent rounded-lg p-6 flex flex-col gap-4 "}>
            <div className={"justify-between flex flex-row"}>
                <h2 className="text-lg font-semibold">Gestion du rôle</h2>
                <div className={clsx("flex items-center gap-2", statusRole.color)}>
                    {statusRole.icon}
                    <span className="text-xs ">{statusRole.text}</span>
                </div>
                <Button className={"cursor-pointer"} size="sm"
                        onClick={() => setSelectedEntity(undefined)}><X/></Button>
            </div>
            <Label>Nom du rôle</Label>
            <Input onChange={(e) => handleUpdateRole(e.target.value)} value={roleName}/>
            <Label>Danseuse assignée</Label>
            {role?.danseuseId && danseuse ? (
                <div
                    className="flex items-center text-sm justify-between gap-2 px-3 py-2 bg-primary text-accent rounded-lg cursor-pointer hover:scale-[90%]">
                    <div onClick={() => setSelectedEntity("danseuse")} className="flex items-center gap-2 ">
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

function ChoreInterGroupeManagement() {
    const {
        selectedEntity,
        setSelectedEntity,
        groupes,
        chore,
        createGroupe,
        setSelectedGroupe,
        selectedGroupe,
        statusGroupe,
    } = useChoregraphieDetail()

    const handleGroupCreation = () => {
        createGroupe({choregraphieId: chore._id})
        setSelectedEntity("groupe")
    }

    const handleExistGroupe = () =>
    {
        setSelectedEntity(undefined)
        setSelectedGroupe(undefined)
    }

    if (selectedEntity !== "groupe" && groupes?.length === 0) {
        return (
            <Button onClick={handleGroupCreation}>
                Créer un groupe
            </Button>
        );
    }

    if (selectedEntity !== "groupe") {
        return <Button onClick={() => setSelectedEntity("groupe")}>Modifier les groupes</Button>
    }

    if (selectedGroupe)
    {
        return (
            <div className={" w-full border border-primary bg-accent rounded-lg p-6 flex flex-col gap-4 "}>
                <div className={"justify-between flex flex-row"}>
                    <h2 className="text-lg font-semibold">Gestion du groupe</h2>
                    <div className={clsx("flex items-center gap-2", statusGroupe.color)}>
                        {statusGroupe.icon}
                        <span className="text-xs ">{statusGroupe.text}</span>
                    </div>
                    <Button className={"cursor-pointer"} size="sm"
                            onClick={handleExistGroupe}><X/></Button>
                </div>
            </div>
        )
    }

    return (
        <div className={" w-full border border-primary bg-accent rounded-lg p-6 flex flex-col gap-4 "}>
            <div className={"justify-between flex flex-row"}>
                <h2 className="text-lg font-semibold">Gestion des groupes</h2>
                <Button className={"cursor-pointer"} size="sm"
                        onClick={() => setSelectedEntity(undefined)}><X/></Button>
            </div>
            {groupes && groupes.length > 0 ? (
                <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {groupes.map((groupe, index) => (
                        <Button key={groupe._id} onClick={() => setSelectedGroupe(groupe._id)}>
                            <span className="font-bold">{groupe.nom || "Groupe " + (index + 1)}</span>
                        </Button>
                    ))}
                </div>
            ) : (
                <span className={"text-sm italic"}>Aucun groupe créé...</span>
            )}
            <Button variant={"outline"} onClick={handleGroupCreation}>Créer un nouveau groupe</Button>
        </div>
    )
}

function ChoreGroupeManagement() {
    return (
        <div className={"grid gap-2"}>
            <ChoreRoleManagement/>
            <ChoreInterGroupeManagement/>
            <ChoreAssignation/>
        </div>
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
        costumes,
        accessoires,
        assignCostumeToDanseuse,
        assignAccessoireToDanseuse,
        danseuse,
        selectedGroupe,
    } = useChoregraphieDetail();

    const [view, setView] = useState<"costumes" | "accessoires">("costumes");

    const {setData, results: filteredData, setQuery} = useSearch<Danseuse | Costume | Accessoire>();


    useEffect(() => {
        if (danseusesLibres && selectedEntity !== "danseuse" && typeof selectedEntity !== "undefined") {
            const sorted = [...danseusesLibres].sort(
                (a, b) => (a.score ?? 0) - (b.score ?? 0)
            );
            setData(sorted);
        }
        if (view === "costumes" && selectedEntity === "danseuse") {
            setData(costumes ?? []);
        }
        if (view === "accessoires" && selectedEntity === "danseuse") {
            setData(accessoires ?? []);
        }
    }, [danseusesLibres, setData, selectedEntity, view, costumes, accessoires]);


    const handleSelectDanseuse = (danseuse: Danseuse) => {
        if (selectedEntity === "role") {
            if (role) {
                updateRole({id: role._id, nom: chore.nom, danseuseId: danseuse._id});
            } else {
                createRole({choregraphieId: chore._id, nom: "", danseuseId: danseuse._id});
            }
        }
        if (selectedEntity === "groupe") {

        }
    };


    if (selectedEntity === "role" || (selectedEntity === "groupe" && selectedGroupe)) {
        const scores = filteredData?.map((d) => d.score ?? 0) ?? [];
        const min = Math.min(...scores, 0);
        const max = Math.max(...scores, 6);
        return (
            <div className="px-4 w-full bg-accent rounded-lg py-4 overflow-y-auto">
                <Input
                    className="sticky top-0 bg-muted mb-2 z-10"
                    placeholder="Rechercher une danseuse"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="grid gap-2">
                    {filteredData?.map((danseuse) => (
                        <Button
                            key={danseuse._id}
                            variant="outline"
                            className="flex flex-col gap-2 h-auto"
                            onClick={() => handleSelectDanseuse(danseuse)}
                        >
                            <Avatar>
                                <AvatarImage src={danseuse.user?.picture}/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{danseuse.nom}</span>
                            <span
                                className="rounded h-2 w-2 text-xs font-semibold"
                                style={{
                                    background: getDangerColor(danseuse.score ?? 0, min, max),
                                    color: "#fff",
                                }}
                            />
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    if (selectedEntity === "danseuse") {
        return (
            <div className="px-4 w-full bg-accent rounded-lg py-4 overflow-y-auto space-y-4">
                <div>
                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(v) => v && setView(v as "costumes" | "accessoires")}
                        className="mb-3 inline-flex w-full gap-0 rounded-md border bg-muted p-1"
                    >
                        <ToggleGroupItem
                            value="costumes"
                            aria-label="Voir costumes"
                            className={clsx(
                                "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                "data-[state=off]:bg-transparent data-[state=off]:text-foreground",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                "disabled:pointer-events-none disabled:opacity-50"
                            )}
                        >
                            Costumes
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="accessoires"
                            aria-label="Voir accessoires"
                            className={clsx(
                                "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                "data-[state=off]:bg-transparent data-[state=off]:text-foreground",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                "disabled:pointer-events-none disabled:opacity-50"
                            )}
                        >
                            Accessoires
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Input
                        className="sticky top-0 bg-muted mb-2 z-10"
                        placeholder={
                            view === "costumes"
                                ? "Rechercher un costume"
                                : "Rechercher un accessoire"
                        }
                        onChange={(e) =>
                            view === "costumes"
                                ? setQuery(e.target.value)
                                : setQuery(e.target.value)
                        }
                    />

                    <div className="grid gap-2 w-full">
                        {view === "costumes"
                            ? filteredData?.map((costume) => (
                                <Button
                                    key={costume._id}
                                    variant="outline"
                                    className="w-full max-w-full overflow-hidden text-left flex flex-col items-center gap-2 h-auto "
                                    onClick={() => assignCostumeToDanseuse({
                                        costumeId: costume._id,
                                        danseuseId: danseuse._id,
                                        parentChoregraphieId: chore._id,
                                        choregraphieId: role?._id
                                    })}
                                >

                                    <span className="font-bold break-words line-clamp-2">{costume.descriptif}</span>
                                    <span className="text-sm italic text-muted-foreground">
      Quantité disponible: {costume.quantite}
    </span>

                                </Button>
                            ))
                            : filteredData?.map((accessoire) => (
                                <Button
                                    key={accessoire._id}
                                    variant="outline"
                                    className="w-full max-w-full overflow-hidden text-left flex flex-col items-center gap-2 h-auto"
                                    onClick={() => assignAccessoireToDanseuse({
                                        accessoireId: accessoire._id,
                                        danseuseId: danseuse._id,
                                        parentChoregraphieId: chore._id,
                                        choregraphieId: role?._id
                                    })}
                                >
                                    <span className="font-bold break-words line-clamp-2">{accessoire.descriptif}</span>
                                    <span className="text-sm italic text-muted-foreground">
                      Quantité disponible: {accessoire.quantite}
                    </span>
                                </Button>
                            ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full space-y-2 w-full p-4 bg-accent rounded-lg">
            <h2 className="text-xl font-bold">Vous pouvez gérer les propositions ici.</h2>
            <p>Sélectionnez un rôle ou un groupe pour voir les options de gestion.</p>
            <p>Sélectionnez une danseuse pour voir les options de costumes et accessoires</p>
        </div>
    );
}


function ChoreAssignation() {

    const {
        selectedEntity,
        danseuse,
        role,
        setSelectedEntity,
        removeAccessoireFromDanseuse,
        removeCostumeFromDanseuse
    } = useChoregraphieDetail()
    const [view, setView] = useState<"costumes" | "accessoires">("costumes");

    if (selectedEntity !== "danseuse") {
        return null
    }

    const handleUnassignAccessoire = (accessoireId: Id<"accessoires">) => {
        removeAccessoireFromDanseuse({
            accessoireId,
            danseuseId: danseuse._id,
            choregraphieId: role?._id,
        });
    };

    const handleUnassignCostume = (costumeId: Id<"costumes">) => {
        removeCostumeFromDanseuse({
            costumeId,
            danseuseId: danseuse._id,
            choregraphieId: role?._id,
        });
    };

    return (
        <div className={"h-full w-full grid gap-2 bg-accent rounded-lg border border-primary p-4"}>
            <div className="flex items-center justify-between ">
                <h3 className="text-lg font-semibold">Costumes et Accessoires</h3>
                <Button onClick={() => setSelectedEntity(undefined)} size={"sm"}><X/></Button>
            </div>
            {danseuse && (
                <span className="text-sm font-bold">Pour {danseuse.nom}</span>
            )}
            <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && setView(v as "costumes" | "accessoires")}
                className="inline-flex w-full gap-0 rounded-md border bg-muted p-1"
            >
                <ToggleGroupItem
                    value="costumes"
                    aria-label="Voir costumes"
                    className={clsx(
                        "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                        "data-[state=off]:bg-transparent data-[state=off]:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        "disabled:pointer-events-none disabled:opacity-50"
                    )}
                >
                    Costumes
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="accessoires"
                    aria-label="Voir accessoires"
                    className={clsx(
                        "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                        "data-[state=off]:bg-transparent data-[state=off]:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        "disabled:pointer-events-none disabled:opacity-50"
                    )}
                >
                    Accessoires
                </ToggleGroupItem>
            </ToggleGroup>
            {danseuse.accessoires?.length > 0 && view === "accessoires" && (
                <div className="max-h-35 overflow-scroll">
                    <div className="flex flex-wrap gap-2">
                        {danseuse.accessoires.map((acc: Accessoire) => (
                            <div
                                key={acc._id}
                                className="group inline-flex items-center gap-2 rounded-md border bg-background/60 px-3 py-1.5 text-sm"
                            >
                <span className="font-medium truncate max-w-[16rem]">
                  {acc.descriptif}
                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnassignAccessoire(acc._id);
                                    }}
                                    aria-label={`Retirer ${acc.descriptif}`}
                                    title="Retirer"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {danseuse.costumes?.length > 0 && view === "costumes" && (
                <div className="max-h-35 overflow-scroll">
                    <div className="flex flex-wrap gap-2">
                        {danseuse.costumes.map((cost: Costume) => (
                            <div
                                key={cost._id}
                                className="group inline-flex items-center gap-2 rounded-md border bg-background/60 px-3 py-1.5 text-sm"
                            >
                <span className="font-medium truncate max-w-[16rem]">
                  {cost.descriptif}
                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnassignCostume(cost._id);
                                    }}
                                    aria-label={`Retirer ${cost.descriptif}`}
                                    title="Retirer"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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