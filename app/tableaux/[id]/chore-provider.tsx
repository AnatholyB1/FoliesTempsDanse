import React, {createContext, use, useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {AlertTriangle, CheckCircle, Loader2, Save} from "lucide-react";
import {Accessoire, Choregraphie, Costume, Danseuse, GroupeChoregraphie, RoleChoregraphie, Tableau, User} from "@/type";
import {toast} from "sonner"

type ChoregraphyUpdateForm = {
    id: Id<"choregraphies">
    data: {
        description?: string | undefined
        blocId?: Id<"tableaux"> | undefined
        musique?: string | undefined
        ordre?: number | undefined
        duree?: number | undefined
        nom?: string | undefined
    }
};

type RoleWithDanseuse = RoleChoregraphie & { danseuse?: Danseuse & { user?: User } };

type DanseuseLibre = Danseuse & User & {
    assignations: {
        costumes: Costume[];
        accessoires: Costume[];
    };
    score: number;
};

type ChoregraphieDetailContextType = {
    form: { nom: string; musique: string; description: string; blocId: string | undefined; duree: number | undefined };
    setForm: React.Dispatch<React.SetStateAction<{
        nom: string;
        musique: string;
        description: string;
        blocId: Id<"tableaux"> | undefined;
        duree: number | undefined;
    }>>;
    dirty: boolean;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    status: { text: string; icon: React.ReactNode; color: string };
    chore: Choregraphie | undefined;
    tableaux: Tableau[];
    updatePending: boolean;
    chorePending: boolean;
    saving: boolean;
    handleUpdate: (data: ChoregraphyUpdateForm) => void;
    groupes: (GroupeChoregraphie & { danseuses: Danseuse[] })[] | undefined;
    roles: RoleWithDanseuse[] | undefined;
    selectedRole: Id<"roles_choregraphie"> | undefined;
    setSelectedRole: React.Dispatch<React.SetStateAction<Id<"roles_choregraphie"> | undefined>>;
    selectedDanseuseId: Id<"danseuses"> | undefined;
    setSelectedDanseuseId: React.Dispatch<React.SetStateAction<Id<"danseuses"> | undefined>>;
    selectedEntity: EntityType | undefined;
    setSelectedEntity: React.Dispatch<React.SetStateAction<EntityType | undefined>>;
    danseusesLibres: DanseuseLibre [] | undefined;
    createRole: (data: { tableauId: Id<"choregraphies">; nom: string, danseuseId?: Id<"danseuses"> }) => void;
    updateRole: (data: { id: Id<"roles_choregraphie">; nom: string; danseuseId?: Id<"danseuses"> }) => void;
    deleteRole: (data: { id: Id<"roles_choregraphie"> }) => void;
    createGroupe: (data: { tableauId: Id<"choregraphies">; nom?: string }) => void;
    updateGroupe: (data: {
        id: Id<"groupes_choregraphie">;
        nom?: string;
        tableauId?: Id<"choregraphies">
    }) => void;
    deleteGroupe: (data: { id: Id<"groupes_choregraphie"> }) => void;
    assignDanseuseToRole: (data: { roleId: Id<"roles_choregraphie">; danseuseId: Id<"danseuses"> }) => void;
    removeDanseuseFromRole: (data: { roleId: Id<"roles_choregraphie"> }) => void;
    assignDanseuseToGroupe: (data: { groupeId: Id<"groupes_choregraphie">; danseuseId: Id<"danseuses">; parentTableauId: Id<"choregraphies"> }) => void;
    removeDanseuseFromGroupe: (data: { groupeId: Id<"groupes_choregraphie">; danseuseId: Id<"danseuses"> }) => void;
    assignCostumeToGroupe: (data: { costumeId: Id<"costumes">; groupeId: Id<"groupes_choregraphie">; parentTableauId: Id<"choregraphies"> }) => void;
    assignAccessoireToGroupe: (data: { accessoireId: Id<"accessoires">; groupeId: Id<"groupes_choregraphie">; parentTableauId: Id<"choregraphies"> }) => void;
    danseuse: Danseuse & User & Costume[] & Accessoire[] | undefined;
    statusRole: { text: string; icon: React.ReactNode; color: string };
    handleUpdateRole: (data: string) => void;
    roleName: string;
    costumes: Costume[];
    accessoires: Accessoire[];
    assignAccessoireToDanseuse: (data: {
        accessoireId: Id<"accessoires">,
        danseuseId: Id<"danseuses">,
        parentTableauId: Id<"choregraphies">,
        roleOuGroupeId: Id<"roles_choregraphie"> | Id<"groupes_choregraphie">
    }) => void;
    assignCostumeToDanseuse: (data: {
        costumeId: Id<"costumes">,
        danseuseId: Id<"danseuses">,
        parentTableauId: Id<"choregraphies">,
        roleOuGroupeId: Id<"roles_choregraphie"> | Id<"groupes_choregraphie">
    }) => void;
    removeAccessoireFromDanseuse: (data: {
        accessoireId: Id<"accessoires">,
        danseuseId: Id<"danseuses">,
        roleOuGroupeId: Id<"roles_choregraphie"> | Id<"groupes_choregraphie">
    }) => void;
    removeCostumeFromDanseuse: (data: {
        costumeId: Id<"costumes">,
        danseuseId: Id<"danseuses">,
        roleOuGroupeId: Id<"roles_choregraphie"> | Id<"groupes_choregraphie">
    }) => void;
    selectedGroupe: Id<"groupes_choregraphie"> | undefined;
    setSelectedGroupe: React.Dispatch<React.SetStateAction<Id<"groupes_choregraphie"> | undefined>>;
    statusGroupe: { text: string; icon: React.ReactNode; color: string };
    handleUpdateGroupe: (data: string) => void;
    groupeName: string;
};

const ChoregraphieDetailContext = createContext<ChoregraphieDetailContextType | undefined>(undefined);

export function useChoregraphieDetail() {
    const ctx = useContext(ChoregraphieDetailContext);
    if (!ctx) throw new Error("useChoregraphieDetail doit être utilisé dans un ChoregraphieDetailProvider");
    return ctx;
}

export type EntityType = "groupe" | "danseuse" | "role" | "groupe-costume" | "groupe-accessoire";


type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export function ChoregraphieDetailProvider({params, children}: Props) {
    const {id} = use(params);
    const tableauId = id as Id<"choregraphies">;
    const [selectedGroupe, setSelectedGroupe] = useState<Id<"groupes_choregraphie"> | undefined>(undefined);

    // chore
    const {
        data: chore,
        isPending: chorePending
    } = useQuery(convexQuery(api.tableaux.getTableau, {id: tableauId}));
    const {mutate: update, isPending: saving, isError, isSuccess} = useMutation({
        mutationFn: useConvexMutation(api.tableaux.updateTableau),
        onSuccess: () => {
            toast("Chorégraphie mise à jour");
        }
    });

    // roles
    const {data: roles} = useQuery(convexQuery(api.roles.getRolesWithDanseuses, {tableauId: tableauId}));
    const {mutate: createRole} = useMutation({
        mutationFn: useConvexMutation(api.roles.createRoleTableau),
        onSuccess: () => {
            toast("Rôle créé");
        }
    });
    const {
        mutate: updateRole,
        isPending: updateRolePending,
        isSuccess: successRole,
        isError: errorRole,
    } = useMutation({
        mutationFn: useConvexMutation(api.roles.updateRoleTableau),
        onSuccess: () => {
            toast("Rôle mis à jour");
        }
    });
    const {mutate: deleteRole} = useMutation({
        mutationFn: useConvexMutation(api.roles.deleteRoleTableau),
        onSuccess: () => {
            toast("Rôle supprimé");
        }
    });

    // groupe
    const {data: groupes} = useQuery(convexQuery(api.tableaux.getGroupesWithDanseuses, {tableauId: tableauId}));
    const {mutate: createGroupe} = useMutation({
        mutationFn: useConvexMutation(api.groupes.createGroupe),
        onSuccess: () => {
            toast("Groupe créé");
        }
    });
    const {
        mutate: updateGroupe,
        isPending: updateGroupePending,
        isSuccess: successGroupe,
        isError: errorGroupe,
    } = useMutation({
        mutationFn: useConvexMutation(api.groupes.updateGroupe),
        onSuccess: () => {
            toast("Groupe mis à jour");
        }
    });
    const {mutate: deleteGroupe} = useMutation({
        mutationFn: useConvexMutation(api.groupes.deleteGroupe),
        onSuccess: () => {
            toast("Groupe supprimé");
        }
    });


    // danseuse
    const {data: danseusesLibres} = useQuery({
        ...convexQuery(api.users.getDanseusesBySaison, { tableauId: tableauId }),
        enabled: !!tableauId
    });
    const {mutate: assignDanseuseToRole} = useMutation({
            mutationFn: useConvexMutation(api.tableaux.assignDanseuseToRole),
            onSuccess: () => {
                toast("Danseuse assignée au rôle");
            }
        }
    )
    const {mutate: removeDanseuseFromRole} = useMutation({
            mutationFn: useConvexMutation(api.tableaux.removeDanseuseFromRole),
            onSuccess: () => {
                toast("Danseuse retirée du rôle");
            }
        }
    )
    const {mutate: assignDanseuseToGroupe} = useMutation({
            mutationFn: useConvexMutation(api.tableaux.assignDanseuseToGroupe),
            onSuccess: (data) => {
                const result = data as { skippedEquipment?: number } | undefined;
                if (result?.skippedEquipment && result.skippedEquipment > 0) {
                    toast.warning(`Danseuse ajoutée, mais ${result.skippedEquipment} équipement(s) non assigné(s) (stock insuffisant)`);
                } else {
                    toast("Danseuse assignée au groupe");
                }
            },
            onError: (err) => {
                toast.error((err as Error).message);
            }
        }
    );
    const {mutate: removeDanseuseFromGroupe} = useMutation({
            mutationFn: useConvexMutation(api.tableaux.removeDanseuseFromGroupe),
            onSuccess: () => {
                toast("Danseuse retirée du groupe");
            }
        }
    );
    const [selectedDanseuseId, setSelectedDanseuseId] = useState<Id<"danseuses"> | undefined>(undefined);
    const {data: danseuse} = useQuery(convexQuery(api.users.getDanseuse, {id: selectedDanseuseId ?? "" as Id<"danseuses">}));


    // tableaux
    const {data: tableaux, isPending: updatePending} = useQuery(convexQuery(api.blocs.getBlocs, {}));


    // costumes
    const {data: costumes} = useQuery(convexQuery(api.costumes.getCostumesAvailable, {}));
    const {mutate: assignCostumeToDanseuse} = useMutation({
        mutationFn: useConvexMutation(api.assignation.assignCostumeToDanseuse),
        onSuccess: () => {
            toast("Costume assigné");
        }
    });
    const {mutate: removeCostumeFromDanseuse} = useMutation({
        mutationFn: useConvexMutation(api.assignation.removeCostumeFromDanseuse),
        onSuccess: () => {
            toast("Costume retiré");
        }
    });

    // accessoires
    const {data: accessoires} = useQuery(convexQuery(api.accessoires.getAccessoiresAvailables, {}));
    const {mutate: assignAccessoireToDanseuse} = useMutation({
        mutationFn: useConvexMutation(api.assignation.assignAccessoireToDanseuse),
        onSuccess: () => {
            toast("Accessoire assigné");
        }
    });
    const {mutate: removeAccessoireFromDanseuse} = useMutation({
        mutationFn: useConvexMutation(api.assignation.removeAccessoireFromDanseuse),
        onSuccess: () => {
            toast("Accessoire retiré");
        }
    });

    // groupe équipements
    const {mutate: assignCostumeToGroupe} = useMutation({
        mutationFn: useConvexMutation(api.assignation.assignCostumeToGroupe),
        onSuccess: (data) => {
            const result = data as { count?: number } | undefined;
            toast.success(`Costume assigné à ${result?.count ?? 0} danseuse(s)`);
        },
        onError: (err) => {
            toast.error((err as Error).message);
        }
    });
    const {mutate: assignAccessoireToGroupe} = useMutation({
        mutationFn: useConvexMutation(api.assignation.assignAccessoireToGroupe),
        onSuccess: (data) => {
            const result = data as { count?: number } | undefined;
            toast.success(`Accessoire assigné à ${result?.count ?? 0} danseuse(s)`);
        },
        onError: (err) => {
            toast.error((err as Error).message);
        }
    });


    const [form, setForm] = useState({nom: "", musique: "", description: "", blocId: chore?.tableauId ?? undefined, duree: chore?.duree ?? undefined as number | undefined});
    const [dirty, setDirty] = useState(false);
    const [dirtyRole, setDirtyRole] = useState(false);
    const [dirtyGroupe, setDirtyGroupe] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<EntityType | undefined>(undefined);
    const [selectedRole, setSelectedRole] = useState<Id<"roles_choregraphie"> | undefined>(undefined);
    const [roleName, setRoleName] = useState<string>("");
    const [groupeName, setGroupeName] = useState<string>(groupes?.filter(g => g._id === selectedGroupe)[0]?.nom ?? "");



    useEffect(() => {
        if (chore) setForm({
            nom: chore.nom,
            musique: chore.musique ?? "",
            description: chore.description ?? "",
            blocId: chore?.tableauId ?? undefined,
            duree: chore.duree ?? undefined
        });
    }, [chore]);

    useEffect(() => {
        if (dirty) {
            const timeout = setTimeout(() => {
                update({id: tableauId, data: form});
                setDirty(false);
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [form, dirty, update, tableauId]);

    useEffect(() => {
        if (selectedRole && roles) {
            const r = roles.find(r => r._id === selectedRole);
            if (r) setRoleName(r.nom ?? "");
        }
    }, [roles, selectedRole]);

    useEffect(
        () => {
            if (groupes && selectedGroupe) {
                const groupe = groupes.filter(g => g._id === selectedGroupe)[0];
                if (groupe) setGroupeName(groupe.nom ?? "");
            }
        }, [groupes, selectedGroupe])

    useEffect(() => {
        if (!dirtyRole) return;
        const timeout = setTimeout(() => {
            if (selectedRole && roleName) {
                updateRole({id: selectedRole, nom: roleName});
            }
            setDirtyRole(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, [roleName, dirtyRole, selectedRole, updateRole]);


    useEffect(() => {
        if (!dirtyGroupe) return;
        const timeout = setTimeout(() => {
            if (groupes && selectedGroupe && groupeName) {
                const groupe = groupes.filter(g => g._id === selectedGroupe)[0];
                if (groupe) {
                    updateGroupe({id: groupe._id as Id<"groupes_choregraphie">, nom: groupeName});
                }
            }
            setDirtyGroupe(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, [groupeName, dirtyGroupe, groupes, selectedGroupe, updateGroupe]);

    let status = {
        text: "A jour",
        icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
        color: "text-green-600"
    };
    if (saving) {
        status = {
            text: "Enregistrement...",
            icon: <Loader2 className="animate-spin text-blue-500 w-4 h-4"/>,
            color: "text-blue-500"
        };
    } else if (isError) {
        status = {
            text: "Erreur",
            icon: <AlertTriangle className="text-red-600 w-4 h-4"/>,
            color: "text-red-600"
        };
    } else if (isSuccess && !dirty) {
        status = {
            text: "Enregistré",
            icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
            color: "text-green-600"
        };
    } else if (dirty) {
        status = {
            text: "Modifications en attente",
            icon: <Save className="text-yellow-500 w-4 h-4"/>,
            color: "text-yellow-500"
        };
    }

    let statusRole = {
        text: "A jour",
        icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
        color: "text-green-600"
    };
    if (updateRolePending) {
        statusRole = {
            text: "Enregistrement...",
            icon: <Loader2 className="animate-spin text-blue-500 w-4 h-4"/>,
            color: "text-blue-500"
        };
    } else if (errorRole) {
        statusRole = {
            text: "Erreur",
            icon: <AlertTriangle className="text-red-600 w-4 h-4"/>,
            color: "text-red-600"
        };
    } else if (successRole && !dirty) {
        statusRole = {
            text: "Enregistré",
            icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
            color: "text-green-600"
        };
    } else if (dirtyRole) {
        statusRole = {
            text: "Modifications en attente",
            icon: <Save className="text-yellow-500 w-4 h-4"/>,
            color: "text-yellow-500"
        };
    }

    let statusGroupe = {
        text: "A jour",
        icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
        color: "text-green-600"
    }
    if (updateGroupePending) {
        statusGroupe = {
            text: "Enregistrement...",
            icon: <Loader2 className="animate-spin text-blue-500 w-4 h-4"/>,
            color: "text-blue-500"
        };
    } else if (errorGroupe) {
        statusGroupe = {
            text: "Erreur",
            icon: <AlertTriangle className="text-red-600 w-4 h-4"/>,
            color: "text-red-600"
        };
    } else if (successGroupe && !dirty) {
        statusGroupe = {
            text: "Enregistré",
            icon: <CheckCircle className="text-green-600 w-4 h-4"/>,
            color: "text-green-600"
        };
    } else if (dirtyGroupe) {
        statusGroupe = {
            text: "Modifications en attente",
            icon: <Save className="text-yellow-500 w-4 h-4"/>,
            color: "text-yellow-500"
        };
    }


    const handleUpdate = (data: ChoregraphyUpdateForm) => {
        update(data);
        setDirty(false);
    };

    const handleUpdateRole = (data: string) => {
        setRoleName(data);
        setDirtyRole(true)
    }

    const handleUpdateGroupe = (data: string) => {
        setGroupeName(data);
        setDirtyGroupe(true)
    }

    const contextValue: ChoregraphieDetailContextType = {
        form,
        setForm,
        dirty,
        setDirty,
        status,
        chore: chore,
        tableaux: tableaux ?? [],
        updatePending,
        chorePending,
        saving,
        handleUpdate,
        groupes,
        roles,
        selectedRole,
        setSelectedRole,
        selectedDanseuseId,
        setSelectedDanseuseId,
        selectedEntity,
        setSelectedEntity,
        danseusesLibres,
        deleteRole,
        createGroupe,
        createRole,
        updateRole,
        updateGroupe,
        deleteGroupe,
        assignDanseuseToRole,
        removeDanseuseFromRole,
        assignDanseuseToGroupe,
        removeDanseuseFromGroupe,
        assignCostumeToGroupe,
        assignAccessoireToGroupe,
        danseuse,
        statusRole,
        handleUpdateRole,
        roleName,
        costumes: costumes ?? [],
        accessoires: accessoires ?? [],
        assignAccessoireToDanseuse,
        assignCostumeToDanseuse,
        removeAccessoireFromDanseuse,
        removeCostumeFromDanseuse,
        selectedGroupe,
        setSelectedGroupe,
        statusGroupe,
        handleUpdateGroupe,
        groupeName
    }

    return (
        <ChoregraphieDetailContext.Provider value={contextValue}>
            {children}
        </ChoregraphieDetailContext.Provider>
    );
}