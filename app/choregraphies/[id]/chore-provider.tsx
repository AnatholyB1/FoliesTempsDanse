import React, {createContext, use, useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {AlertTriangle, CheckCircle, Loader2, Save} from "lucide-react";
import {Choregraphie, Costume, Danseuse, GroupeChoregraphie, RoleChoregraphie, Tableau, User} from "@/type";
import {toast} from "sonner"

type ChoregraphyUpdateForm = {
    id: Id<"choregraphies">
    data: {
        description?: string | undefined
        tableauId?: Id<"tableaux"> | undefined
        musique?: string | undefined
        ordre?: number | undefined
        duree?: number | undefined
        nom?: string | undefined
    }
};

type DanseuseLibre = Danseuse & User & {
    assignations: {
        costumes: Costume[];
        accessoires: Costume[];
    };
    score: number;
};

type ChoregraphieDetailContextType = {
    form: { nom: string; musique: string; description: string; tableauId: string | undefined };
    setForm: React.Dispatch<React.SetStateAction<{
        nom: string;
        musique: string;
        description: string;
        tableauId: Id<"tableaux"> | undefined;
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
    groupes: GroupeChoregraphie[] | undefined;
    role: RoleChoregraphie | undefined;
    selectedEntity: EntityType | undefined;
    setSelectedEntity: React.Dispatch<React.SetStateAction<EntityType | undefined>>;
    danseusesLibres: DanseuseLibre [] | undefined;
    createRole: (data: { choregraphieId: Id<"choregraphies">; nom: string, danseuseId?: Id<"danseuses"> }) => void;
    updateRole: (data: { id: Id<"roles_choregraphie">; nom: string; danseuseId?: Id<"danseuses"> }) => void;
    deleteRole: (data: { id: Id<"roles_choregraphie"> }) => void;
    createGroupe: (data: { choregraphieId: Id<"choregraphies">; nom: string }) => void;
    updateGroupe: (data: {
        id: Id<"groupes_choregraphie">;
        nom?: string;
        choregraphieId?: Id<"choregraphies">
    }) => void;
    deleteGroupe: (data: { id: Id<"groupes_choregraphie"> }) => void;
    assignDanseuseToRole: (data: { roleId: Id<"roles_choregraphie">; danseuseId: Id<"danseuses"> }) => void;
    removeDanseuseFromRole: (data: { roleId: Id<"roles_choregraphie"> }) => void;
    assignDanseuseToGroupe: (data: { groupeId: Id<"groupes_choregraphie">; danseuseId: Id<"danseuses"> }) => void;
    removeDanseuseFromGroupe: (data: { groupeId: Id<"groupes_choregraphie">; danseuseId: Id<"danseuses"> }) => void;
    danseuse: Danseuse & User | undefined;
    statusRole: { text: string; icon: React.ReactNode; color: string };
    handleUpdateRole: (data: string) => void;
    roleName: string;
};

const ChoregraphieDetailContext = createContext<ChoregraphieDetailContextType | undefined>(undefined);

export function useChoregraphieDetail() {
    const ctx = useContext(ChoregraphieDetailContext);
    if (!ctx) throw new Error("useChoregraphieDetail doit être utilisé dans un ChoregraphieDetailProvider");
    return ctx;
}

export type EntityType = "groupe" | "danseuse" | "role";


type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export function ChoregraphieDetailProvider({params, children}: Props) {
    const {id} = use(params);
    const choregraphieId = id as Id<"choregraphies">;

    // chore
    const {
        data: chore,
        isPending: chorePending
    } = useQuery(convexQuery(api.choregraphies.getChoregraphie, {id: choregraphieId}));
    const {mutate: update, isPending: saving, isError, isSuccess} = useMutation({
        mutationFn: useConvexMutation(api.choregraphies.updateChoregraphie),
        onSuccess: () => {
            toast("Chorégraphie mise à jour");
        }
    });

    // role
    const {data: role} = useQuery(convexQuery(api.roles.getRoleChoregraphieByChoregraphie, {choregraphieId: choregraphieId}),);
    const {mutate: createRole} = useMutation({
        mutationFn: useConvexMutation(api.roles.createRoleChoregraphie),
        onSuccess: () => {
            toast("Rôle créé");
        }
    });
    const {mutate: updateRole, isPending : updateRolePending, isSuccess : successRole, isError : errorRole, } = useMutation({
        mutationFn: useConvexMutation(api.roles.updateRoleChoregraphie),
        onSuccess: () => {
            toast("Rôle mis à jour");
        }
    });
    const {mutate: deleteRole} = useMutation({
        mutationFn: useConvexMutation(api.roles.deleteRoleChoregraphie),
        onSuccess: () => {
            toast("Rôle supprimé");
        }
    });

    // groupe
    const {data: groupes} = useQuery(convexQuery(api.choregraphies.getGroupesByChoregraphie, {choregraphieId: choregraphieId}));
    const {mutate: createGroupe} = useMutation({
        mutationFn: useConvexMutation(api.groupes.createGroupe),
        onSuccess: () => {
            toast("Groupe créé");
        }
    });
    const {mutate: updateGroupe} = useMutation({
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
    const {data: danseusesLibres} = useQuery({...convexQuery(api.users.getDanseusesBySaison, {choreId: choregraphieId}), enabled : !!choregraphieId});
    const {mutate: assignDanseuseToRole} = useMutation({
            mutationFn: useConvexMutation(api.choregraphies.assignDanseuseToRole),
            onSuccess: () => {
                toast("Danseuse assignée au rôle");
            }
        }
    )
    const {mutate: removeDanseuseFromRole} = useMutation({
            mutationFn: useConvexMutation(api.choregraphies.removeDanseuseFromRole),
            onSuccess: () => {
                toast("Danseuse retirée du rôle");
            }
        }
    )
    const {mutate: assignDanseuseToGroupe} = useMutation({
            mutationFn: useConvexMutation(api.choregraphies.assignDanseuseToGroupe),
            onSuccess: () => {
                toast("Danseuse assignée au groupe");
            }
        }
    );
    const {mutate: removeDanseuseFromGroupe} = useMutation({
            mutationFn: useConvexMutation(api.choregraphies.removeDanseuseFromGroupe),
            onSuccess: () => {
                toast("Danseuse retirée du groupe");
            }
        }
    );
    const {data: danseuse} = useQuery(convexQuery(api.users.getDanseuse, {id: role?.danseuseId ?? "" as Id<"danseuses">}));


    // tableaux
    const {data: tableaux, isPending: updatePending} = useQuery(convexQuery(api.tableaux.getTableaux, {}));


    const [form, setForm] = useState({nom: "", musique: "", description: "", tableauId: chore?.tableauId ?? undefined});
    const [dirty, setDirty] = useState(false);
    const [dirtyRole, setDirtyRole] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<EntityType | undefined>(undefined);
    const [roleName, setRoleName] = useState<string>(role?.nom ?? "");


    useEffect(() => {
        if (chore) setForm({
            nom: chore.nom,
            musique: chore.musique ?? "",
            description: chore.description ?? "",
            tableauId: chore?.tableauId ?? undefined
        });
    }, [chore]);

    useEffect(() => {
        if (dirty) {
            const timeout = setTimeout(() => {
                update({id: choregraphieId, data: form});
                setDirty(false);
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [form, dirty, update, choregraphieId]);

    useEffect(() => {
        if (role) setRoleName(role.nom);
    }, [role]);

    useEffect(() => {
        if (!dirtyRole) return;
        const timeout = setTimeout(() => {
            if (role && roleName) {
                updateRole({ id: role._id as Id<"roles_choregraphie">, nom: roleName });
            }
            setDirtyRole(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, [roleName, dirtyRole, role, updateRole]);

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
    } else if ( successRole && !dirty) {
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

    const handleUpdate = (data: ChoregraphyUpdateForm) => {
        update(data);
        setDirty(false);
    };

    const handleUpdateRole = (data: string) => {
        setRoleName(data);
        setDirtyRole(true)
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
        role,
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
        danseuse,
        statusRole,
        handleUpdateRole,
        roleName
    }

    return (
        <ChoregraphieDetailContext.Provider value={contextValue}>
            {children}
        </ChoregraphieDetailContext.Provider>
    );
}