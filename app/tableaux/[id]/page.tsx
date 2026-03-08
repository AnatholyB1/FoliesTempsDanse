"use client";
import {Id} from "@/convex/_generated/dataModel";
import NotFound from "@/app/not-found";
import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {clsx} from "clsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useChoregraphieDetail} from "./chore-provider";
import {Button} from "@/components/ui/button";
import {Clock, Music, Pencil, Plus, Shirt, Sparkles, Trash2, User, Users, X} from "lucide-react";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useSearch} from "@/components/global-search";
import {useEffect, useState} from "react";
import {Accessoire, Costume, Danseuse} from "@/type";
import {Label} from "@/components/ui/label";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";


function ChoreSkeleton() {
    return (
        <div className="max-w-6xl w-full mx-auto py-8 px-4 space-y-4">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-px w-16 rounded-full" />
            <Skeleton className="h-44 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <Skeleton className="h-36 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
                <Skeleton className="min-h-[300px] w-full rounded-xl" />
            </div>
        </div>
    );
}

// --- Infos du tableau (auto-save) ---
function ChoreInfos() {
    const { form, setForm, setDirty, chore, tableaux, handleUpdate, status } = useChoregraphieDetail();
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Informations
                    </CardTitle>
                    <div className={clsx("flex items-center gap-1.5 text-xs", status.color)}>
                        {status.icon}
                        <span>{status.text}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Nom du tableau</Label>
                    <Input
                        value={form.nom}
                        onChange={e => { setForm(f => ({ ...f, nom: e.target.value })); setDirty(true); }}
                        className="font-semibold"
                        placeholder="Nom du tableau"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1 block">
                            <Music className="w-3 h-3" /> Musique
                        </Label>
                        <Input
                            value={form.musique}
                            onChange={e => { setForm(f => ({ ...f, musique: e.target.value })); setDirty(true); }}
                            placeholder="Titre de la musique"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1 block">
                            <Clock className="w-3 h-3" /> Durée
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                min={0}
                                value={form.duree ?? ""}
                                onChange={e => {
                                    const v = e.target.value === "" ? undefined : Number(e.target.value);
                                    setForm(f => ({ ...f, duree: v }));
                                    setDirty(true);
                                }}
                                placeholder="Secondes"
                                className="pr-14"
                            />
                            {form.duree !== undefined && form.duree > 0 && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none tabular-nums">
                                    {Math.floor(form.duree / 60)}m{String(form.duree % 60).padStart(2, "0")}s
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Bloc</Label>
                    <Select
                        value={form.blocId ?? ""}
                        onValueChange={(value) => handleUpdate({ id: chore._id, data: { blocId: value as Id<"tableaux"> } })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un bloc" />
                        </SelectTrigger>
                        <SelectContent>
                            {tableaux?.map((t) => (
                                <SelectItem key={t._id} value={t._id}>{t.nom}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                    <Textarea
                        value={form.description}
                        onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setDirty(true); }}
                        placeholder="Description optionnelle"
                        rows={2}
                        className="resize-none"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

// --- Section rôles ---
function RoleSection() {
    const {
        roles, chore, createRole, deleteRole,
        selectedRole, setSelectedRole,
        selectedEntity, setSelectedEntity,
        roleName, handleUpdateRole, statusRole,
        removeDanseuseFromRole,
        setSelectedDanseuseId,
    } = useChoregraphieDetail();

    const handleCreate = () => {
        createRole({ tableauId: chore._id, nom: "Rôle solo" });
        setSelectedEntity("role");
    };

    const handleSelectRole = (id: Id<"roles_choregraphie">) => {
        setSelectedRole(id);
        setSelectedEntity("role");
    };

    const handleClose = () => {
        setSelectedRole(undefined);
        setSelectedEntity(undefined);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Rôles solos
                        {roles && roles.length > 0 && (
                            <Badge variant="secondary" className="text-xs font-medium">
                                {roles.length}
                            </Badge>
                        )}
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={handleCreate}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {!roles || roles.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-3 text-center">
                        <User className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Aucun rôle solo défini</p>
                        <Button size="sm" variant="outline" onClick={handleCreate}>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Créer un rôle
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {roles.map((role, index) => {
                            const isSelected =
                                selectedRole === role._id && selectedEntity === "role";
                            return (
                                <div
                                    key={role._id}
                                    className={clsx(
                                        "rounded-lg border p-3 space-y-2 transition-all duration-200",
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-muted/20 hover:bg-muted/40"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {isSelected ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <Input
                                                    value={roleName}
                                                    onChange={e => handleUpdateRole(e.target.value)}
                                                    placeholder={"Rôle " + (index + 1)}
                                                    className="h-7 text-sm flex-1"
                                                    autoFocus
                                                />
                                                <div className={clsx("shrink-0", statusRole.color)}>
                                                    {statusRole.icon}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSelectRole(role._id)}
                                                className="flex-1 flex items-center gap-1.5 text-left group/edit"
                                            >
                                                <span className="text-sm font-medium">
                                                    {role.nom || "Rôle " + (index + 1)}
                                                </span>
                                                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {!role.danseuse && (
                                                <Button
                                                    size="sm"
                                                    variant={isSelected ? "default" : "outline"}
                                                    className="h-7 text-xs px-2"
                                                    onClick={() =>
                                                        isSelected
                                                            ? handleClose()
                                                            : handleSelectRole(role._id)
                                                    }
                                                >
                                                    {isSelected ? (
                                                        <><X className="w-3 h-3 mr-1" /> Fermer</>
                                                    ) : (
                                                        <><Plus className="w-3 h-3 mr-1" /> Danseuse</>
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => {
                                                    deleteRole({ id: role._id });
                                                    if (selectedRole === role._id) handleClose();
                                                }}
                                                title="Supprimer le rôle"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    {role.danseuse && (
                                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                                            <button
                                                onClick={() => {
                                                    setSelectedRole(role._id);
                                                    setSelectedDanseuseId(role.danseuse!._id);
                                                    setSelectedEntity("danseuse");
                                                }}
                                                className="flex items-center gap-2 flex-1 text-left hover:opacity-75 transition-opacity"
                                                title="Voir costumes & accessoires"
                                            >
                                                <Avatar className="h-7 w-7 shrink-0">
                                                    <AvatarImage src={role.danseuse.user?.picture} />
                                                    <AvatarFallback className="text-xs">
                                                        {role.danseuse.nom?.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium truncate">{role.danseuse.nom}</span>
                                            </button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeDanseuseFromRole({ roleId: role._id })}
                                                title="Retirer la danseuse"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- Section groupes ---
function GroupesSection() {
    const {
        groupes, chore, createGroupe, deleteGroupe,
        selectedGroupe, setSelectedGroupe,
        selectedEntity, setSelectedEntity,
        groupeName, handleUpdateGroupe, statusGroupe,
        removeDanseuseFromGroupe,
    } = useChoregraphieDetail();

    const handleCreate = () => {
        createGroupe({ tableauId: chore._id });
        setSelectedEntity("groupe");
    };

    const handleSelectGroupe = (id: Id<"groupes_choregraphie">) => {
        setSelectedGroupe(id);
        setSelectedEntity("groupe");
    };

    const handleClose = () => {
        setSelectedGroupe(undefined);
        setSelectedEntity(undefined);
    };

    const isGroupeActive = (id: Id<"groupes_choregraphie">) =>
        selectedGroupe === id &&
        (selectedEntity === "groupe" || selectedEntity === "groupe-costume" || selectedEntity === "groupe-accessoire");

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Groupes
                        {groupes && groupes.length > 0 && (
                            <Badge variant="secondary" className="text-xs font-medium">
                                {groupes.length}
                            </Badge>
                        )}
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={handleCreate}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {!groupes || groupes.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-3 text-center">
                        <Users className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">Aucun groupe créé</p>
                        <Button size="sm" variant="outline" onClick={handleCreate}>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Créer un groupe
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {groupes.map((groupe, index) => {
                            const isNameSelected =
                                selectedGroupe === groupe._id && selectedEntity === "groupe";
                            const isActive = isGroupeActive(groupe._id);
                            return (
                                <div
                                    key={groupe._id}
                                    className={clsx(
                                        "rounded-lg border p-3 space-y-2 transition-all duration-200",
                                        isActive
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-muted/20 hover:bg-muted/40"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {isNameSelected ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <Input
                                                    value={groupeName}
                                                    onChange={e => handleUpdateGroupe(e.target.value)}
                                                    placeholder={"Groupe " + (index + 1)}
                                                    className="h-7 text-sm flex-1"
                                                    autoFocus
                                                />
                                                <div className={clsx("shrink-0", statusGroupe.color)}>
                                                    {statusGroupe.icon}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSelectGroupe(groupe._id)}
                                                className="flex-1 flex items-center gap-1.5 text-left group/edit"
                                            >
                                                <span className="text-sm font-medium">
                                                    {groupe.nom || "Groupe " + (index + 1)}
                                                </span>
                                                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {isActive ? (
                                                <Button size="sm" variant="default" className="h-7 text-xs px-2" onClick={handleClose}>
                                                    <X className="w-3 h-3 mr-1" /> Fermer
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => handleSelectGroupe(groupe._id)}>
                                                    <Plus className="w-3 h-3 mr-1" /> Danseuse
                                                </Button>
                                            )}
                                            {groupe.danseuses && groupe.danseuses.length > 0 && !isActive && (
                                                <>
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="h-7 text-xs px-2"
                                                        title="Assigner un costume à tout le groupe"
                                                        onClick={() => { setSelectedGroupe(groupe._id); setSelectedEntity("groupe-costume"); }}
                                                    >
                                                        <Shirt className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="h-7 text-xs px-2"
                                                        title="Assigner un accessoire à tout le groupe"
                                                        onClick={() => { setSelectedGroupe(groupe._id); setSelectedEntity("groupe-accessoire"); }}
                                                    >
                                                        <Sparkles className="w-3 h-3" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="icon" variant="ghost"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => {
                                                    deleteGroupe({ id: groupe._id });
                                                    if (selectedGroupe === groupe._id) handleClose();
                                                }}
                                                title="Supprimer le groupe"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    {groupe.danseuses && groupe.danseuses.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {groupe.danseuses.map((d: Danseuse) => (
                                                <div key={d._id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs border border-border/50">
                                                    <span>{d.nom}</span>
                                                    <button
                                                        onClick={() => removeDanseuseFromGroupe({ groupeId: groupe._id, danseuseId: d._id })}
                                                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                                                        title="Retirer"
                                                    >
                                                        <X className="h-2.5 w-2.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ChoreGroupeManagement() {
    return (
        <div className="space-y-4">
            <RoleSection />
            <GroupesSection />
            <ChoreAssignation />
        </div>
    );
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
        setSelectedEntity,
        danseusesLibres,
        updateRole,
        roles,
        selectedRole,
        chore,
        createRole,
        costumes,
        accessoires,
        assignCostumeToDanseuse,
        assignAccessoireToDanseuse,
        assignDanseuseToGroupe,
        assignCostumeToGroupe,
        assignAccessoireToGroupe,
        danseuse,
        selectedGroupe,
    } = useChoregraphieDetail();

    const [view, setView] = useState<"costumes" | "accessoires">("costumes");

    const {setData, results: filteredData, setQuery} = useSearch<Danseuse | Costume | Accessoire>();


    useEffect(() => {
        setQuery("");
        if (
            danseusesLibres &&
            selectedEntity !== "danseuse" &&
            selectedEntity !== "groupe-costume" &&
            selectedEntity !== "groupe-accessoire" &&
            typeof selectedEntity !== "undefined"
        ) {
            const sorted = [...danseusesLibres].sort(
                (a, b) => (a.score ?? 0) - (b.score ?? 0)
            );
            setData(sorted);
        }
        if ((view === "costumes" && selectedEntity === "danseuse") || selectedEntity === "groupe-costume") {
            setData(costumes ?? []);
        }
        if ((view === "accessoires" && selectedEntity === "danseuse") || selectedEntity === "groupe-accessoire") {
            setData(accessoires ?? []);
        }
    }, [danseusesLibres, setData, setQuery, selectedEntity, view, costumes, accessoires]);


    const handleSelectDanseuse = (danseuse: Danseuse) => {
        if (selectedEntity === "role") {
            const currentRole = roles?.find(r => r._id === selectedRole);
            if (currentRole) {
                updateRole({ id: currentRole._id, nom: currentRole.nom ?? "", danseuseId: danseuse._id });
            } else {
                createRole({ tableauId: chore._id, nom: "Rôle solo", danseuseId: danseuse._id });
            }
            setSelectedEntity(undefined);
        }
        if (selectedEntity === "groupe" && selectedGroupe) {
            assignDanseuseToGroupe({ groupeId: selectedGroupe, danseuseId: danseuse._id, parentTableauId: chore._id });
            setSelectedEntity(undefined);
        }
    };


    if (selectedEntity === "role" || (selectedEntity === "groupe" && selectedGroupe)) {
        const scores = filteredData?.map((d) => d.score ?? 0) ?? [];
        const min = Math.min(...scores, 0);
        const max = Math.max(...scores, 6);
        return (
            <div className="w-full bg-accent rounded-xl border p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Danseuses disponibles
                    </h3>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedEntity(undefined)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Input
                    className="bg-background shrink-0"
                    placeholder="Rechercher une danseuse…"
                    onChange={(e) => setQuery(e.target.value)}
                />
                {filteredData?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucune danseuse disponible</p>
                )}
                <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 min-h-0">
                    {filteredData?.map((danseuse) => (
                        <button
                            key={danseuse._id}
                            onClick={() => handleSelectDanseuse(danseuse)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-all text-center group"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={danseuse.user?.picture} />
                                <AvatarFallback className="text-xs">
                                    {danseuse.nom?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium leading-tight">{danseuse.nom}</span>
                            <span
                                className="h-1.5 w-8 rounded-full"
                                style={{ background: getDangerColor(danseuse.score ?? 0, min, max) }}
                                title={`Score de proximité : ${danseuse.score ?? 0}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if ((selectedEntity === "groupe-costume" || selectedEntity === "groupe-accessoire") && selectedGroupe) {
        return (
            <div className="w-full bg-accent rounded-xl border p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Équipement du groupe
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Assigné à toutes les danseuses du groupe</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedEntity(undefined)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <ToggleGroup
                    type="single"
                    value={selectedEntity === "groupe-costume" ? "costumes" : "accessoires"}
                    onValueChange={(v) => v && setSelectedEntity(v === "costumes" ? "groupe-costume" : "groupe-accessoire")}
                    className="grid grid-cols-2 w-full rounded-lg border bg-muted p-1 gap-1 shrink-0"
                >
                    <ToggleGroupItem value="costumes" className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium">
                        Costumes
                    </ToggleGroupItem>
                    <ToggleGroupItem value="accessoires" className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium">
                        Accessoires
                    </ToggleGroupItem>
                </ToggleGroup>
                <Input
                    className="bg-background shrink-0"
                    placeholder={selectedEntity === "groupe-costume" ? "Rechercher un costume…" : "Rechercher un accessoire…"}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {filteredData?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun {selectedEntity === "groupe-costume" ? "costume" : "accessoire"} disponible
                    </p>
                )}
                <div className="grid gap-2 overflow-y-auto flex-1 min-h-0">
                    {selectedEntity === "groupe-costume"
                        ? filteredData?.map((costume) => (
                            <button
                                key={costume._id}
                                onClick={() => assignCostumeToGroupe({ costumeId: costume._id, groupeId: selectedGroupe, parentTableauId: chore._id })}
                                className="flex items-center gap-3 p-2 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                    {costume.photo
                                        ? <Image src={costume.photo} alt={costume.descriptif ?? ""} width={40} height={40} className="object-cover w-full h-full" />
                                        : <Shirt className="w-4 h-4 text-muted-foreground/50" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium line-clamp-2 block">{costume.descriptif}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums">×{costume.quantite} dispo</span>
                                </div>
                            </button>
                        ))
                        : filteredData?.map((accessoire) => (
                            <button
                                key={accessoire._id}
                                onClick={() => assignAccessoireToGroupe({ accessoireId: accessoire._id, groupeId: selectedGroupe, parentTableauId: chore._id })}
                                className="flex items-center gap-3 p-2 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                    {accessoire.photo
                                        ? <Image src={accessoire.photo} alt={accessoire.descriptif ?? ""} width={40} height={40} className="object-cover w-full h-full" />
                                        : <Sparkles className="w-4 h-4 text-muted-foreground/50" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium line-clamp-2 block">{accessoire.descriptif}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums">×{accessoire.quantite} dispo</span>
                                </div>
                            </button>
                        ))
                    }
                </div>
            </div>
        );
    }

    if (selectedEntity === "danseuse") {
        return (
            <div className="w-full bg-accent rounded-xl border p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Assigner un équipement
                        </h3>
                        {danseuse && (
                            <p className="text-xs text-muted-foreground mt-0.5">Pour {danseuse.nom}</p>
                        )}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedEntity(undefined)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(v) => v && setView(v as "costumes" | "accessoires")}
                    className="grid grid-cols-2 w-full rounded-lg border bg-muted p-1 gap-1 shrink-0"
                >
                    <ToggleGroupItem
                        value="costumes"
                        className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium"
                    >
                        Costumes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="accessoires"
                        className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium"
                    >
                        Accessoires
                    </ToggleGroupItem>
                </ToggleGroup>

                <Input
                    className="bg-background shrink-0"
                    placeholder={view === "costumes" ? "Rechercher un costume…" : "Rechercher un accessoire…"}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {filteredData?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun {view === "costumes" ? "costume" : "accessoire"} disponible
                    </p>
                )}

                <div className="grid gap-2 overflow-y-auto flex-1 min-h-0">
                    {view === "costumes"
                        ? filteredData?.map((costume) => (
                            <button
                                key={costume._id}
                                onClick={() => assignCostumeToDanseuse({
                                    costumeId: costume._id,
                                    danseuseId: danseuse._id,
                                    parentTableauId: chore._id,
                                    roleOuGroupeId: (selectedRole ?? selectedGroupe)!,
                                })}
                                className="flex items-center gap-3 p-2 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left group"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                    {costume.photo
                                        ? <Image src={costume.photo} alt={costume.descriptif ?? ""} width={40} height={40} className="object-cover w-full h-full" />
                                        : <Shirt className="w-4 h-4 text-muted-foreground/50" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium line-clamp-2 block">{costume.descriptif}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums">×{costume.quantite}</span>
                                </div>
                            </button>
                        ))
                        : filteredData?.map((accessoire) => (
                            <button
                                key={accessoire._id}
                                onClick={() => assignAccessoireToDanseuse({
                                    accessoireId: accessoire._id,
                                    danseuseId: danseuse._id,
                                    parentTableauId: chore._id,
                                    roleOuGroupeId: (selectedRole ?? selectedGroupe)!,
                                })}
                                className="flex items-center gap-3 p-2 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left group"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                    {accessoire.photo
                                        ? <Image src={accessoire.photo} alt={accessoire.descriptif ?? ""} width={40} height={40} className="object-cover w-full h-full" />
                                        : <Sparkles className="w-4 h-4 text-muted-foreground/50" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium line-clamp-2 block">{accessoire.descriptif}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums">×{accessoire.quantite}</span>
                                </div>
                            </button>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-12 px-6 bg-accent rounded-xl border text-center gap-3">
            <Users className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">Sélectionnez un rôle ou un groupe</p>
            <p className="text-xs text-muted-foreground/70">
                Choisissez une danseuse à assigner, ou cliquez sur une danseuse assignée pour gérer ses costumes et accessoires.
            </p>
        </div>
    );
}


function ChoreAssignation() {
    const {
        selectedEntity,
        danseuse,
        selectedRole,
        selectedGroupe,
        setSelectedEntity,
        removeAccessoireFromDanseuse,
        removeCostumeFromDanseuse,
    } = useChoregraphieDetail();
    const [view, setView] = useState<"costumes" | "accessoires">("costumes");

    if (selectedEntity !== "danseuse") return null;

    const handleUnassignAccessoire = (accessoireId: Id<"accessoires">) => {
        removeAccessoireFromDanseuse({
            accessoireId,
            danseuseId: danseuse._id,
            roleOuGroupeId: (selectedRole ?? selectedGroupe)!,
        });
    };

    const handleUnassignCostume = (costumeId: Id<"costumes">) => {
        removeCostumeFromDanseuse({
            costumeId,
            danseuseId: danseuse._id,
            roleOuGroupeId: (selectedRole ?? selectedGroupe)!,
        });
    };

    const hasCostumes = (danseuse?.costumes?.length ?? 0) > 0;
    const hasAccessoires = (danseuse?.accessoires?.length ?? 0) > 0;

    return (
        <Card className="border-primary/30">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold">Équipements assignés</CardTitle>
                        {danseuse && (
                            <p className="text-xs text-muted-foreground mt-0.5">Pour {danseuse.nom}</p>
                        )}
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setSelectedEntity(undefined)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(v) => v && setView(v as "costumes" | "accessoires")}
                    className="grid grid-cols-2 w-full rounded-lg border bg-muted p-1 gap-1"
                >
                    <ToggleGroupItem
                        value="costumes"
                        className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium"
                    >
                        Costumes {hasCostumes && <Badge variant="secondary" className="ml-1 text-xs">{danseuse.costumes.length}</Badge>}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="accessoires"
                        className="rounded-md text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:font-medium"
                    >
                        Accessoires {hasAccessoires && <Badge variant="secondary" className="ml-1 text-xs">{danseuse.accessoires.length}</Badge>}
                    </ToggleGroupItem>
                </ToggleGroup>

                {view === "costumes" && (
                    !hasCostumes ? (
                        <p className="text-xs text-muted-foreground text-center py-3">Aucun costume assigné</p>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {danseuse.costumes.map((cost: Costume) => (
                                <div
                                    key={cost._id}
                                    className="inline-flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs"
                                >
                                    <span className="font-medium max-w-[14rem] truncate">{cost.descriptif}</span>
                                    <button
                                        onClick={() => handleUnassignCostume(cost._id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                                        title="Retirer"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {view === "accessoires" && (
                    !hasAccessoires ? (
                        <p className="text-xs text-muted-foreground text-center py-3">Aucun accessoire assigné</p>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {danseuse.accessoires.map((acc: Accessoire) => (
                                <div
                                    key={acc._id}
                                    className="inline-flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1 text-xs"
                                >
                                    <span className="font-medium max-w-[14rem] truncate">{acc.descriptif}</span>
                                    <button
                                        onClick={() => handleUnassignAccessoire(acc._id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                                        title="Retirer"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}


export default function ChoregraphieDetailPage() {
    const { chorePending, chore } = useChoregraphieDetail();

    if (chorePending) return <ChoreSkeleton />;
    if (!chore) return <NotFound />;

    return (
        <div className="max-w-6xl w-full mx-auto py-8 px-4 space-y-6">
            <ChoreInfos />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <ChoreGroupeManagement />
                <div className="sticky top-6 flex flex-col max-h-[calc(100vh-5rem)] overflow-hidden">
                    <ChoreProposition />
                </div>
            </div>
        </div>
    );
}