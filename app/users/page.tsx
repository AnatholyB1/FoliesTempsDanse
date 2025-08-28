"use client";
import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "sonner";
import {Id} from "@/convex/_generated/dataModel";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger} from "@/components/ui/dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Assignation, Danseuse, Role, Saison, User} from "@/type";
import {useSearch} from "@/components/global-search";
import Link from "next/link";

const danseuseSchema = z.object({
  userId: z.string().min(1, ),
  checked: z.boolean(),
  infos: z.string().min(1),
  nom: z.string().min(1),
  saisonId: z.string().min(1),
});

type DanseuseValues = z.infer<typeof danseuseSchema>;

type UserUp = User & {
  danseuse?: Danseuse
  assignations?: Assignation[];
}

export default function UsersPage() {
  const [openDialog, setOpenDialog] = useState<string>("");
  // Mutation pour créer/supprimer la danseuse
  const {mutate: setDanseuse, isPending: danseusePending} = useMutation({
    mutationFn: useConvexMutation(api.users.setDanseuse),
    onSuccess: () => {
      toast.success("Danseuse créée/supprimée avec succès");
      form.reset();
      setOpenDialog("");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la danseuse");
    },
  });
  // Récupère la liste des utilisateurs
  const {data: users, isPending} = useQuery(
    convexQuery(api.users.getUsers, {})
  );
  const {setQuery, results, setData} = useSearch<UserUp>()
  // Mutation pour assigner un rôle
  const {mutate: assignRole, isPending: assignRolePending} = useMutation({
    mutationFn: useConvexMutation(api.users.assignRole),
    onSuccess: () => {
      toast.success("Rôle assigné");
    },
    onError: () => {
      toast.error("Erreur lors de l'assignation du rôle");
    },
  });
  // Récupération des roles
  const {data: roles, isPending: rolesPending} = useQuery(
    convexQuery(api.users.getRoles, {})
  );
  //récupère les saisons
  const {data: saisons} = useQuery(convexQuery(api.saisons.getSaisons, {}));

  useEffect(() => {
    if(users && users.length > 0)
    {
      setData(users)
    }
  }, [users, setData]);

  const handleRoleChange = async (userId: Id<"users">, roleId: Id<"roles">) => {
    assignRole({userId, roleId});
  };

  const handleCheck = (userId: Id<"users">, checked: boolean) => {
    form.setValue("userId", userId);
    form.setValue("checked", checked);
  };

  const form = useForm<DanseuseValues>({
    defaultValues: {
      userId: "",
      checked: false,
      infos: "",
      nom: "",
      saisonId: "",
    },
    resolver: zodResolver(danseuseSchema),
    mode: "onChange",
  });

  const onSubmit = (data: DanseuseValues) => {
    setDanseuse({
      ...data,
      userId: data.userId as Id<"users">,
      saisonId: data.saisonId as unknown as Id<"saison">,
    });
  };

  if (isPending || rolesPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="relative border-border rounded-lg p-4 shadow-sm bg-background"
            >
              <div className="flex flex-row items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-6 bg-muted rounded animate-pulse"/>
                    <div className="w-16 h-5 bg-muted rounded animate-pulse"/>
                  </div>
                </div>
                <div className="w-20 h-6 bg-muted rounded animate-pulse"/>
              </div>
              <div className="mb-2">
                <div className="w-32 h-4 bg-muted rounded animate-pulse"/>
              </div>
              <div className="mb-2">
                <div className="w-24 h-4 bg-muted rounded animate-pulse"/>
              </div>
              <div className="mb-2">
                <div className="w-full h-10 bg-muted rounded animate-pulse"/>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 bg-muted rounded animate-pulse"/>
                <div className="w-20 h-4 bg-muted rounded animate-pulse"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // si il n'y a pas de saisons, on affiche un mmessage
  if (!saisons || saisons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>
        <p className="text-red-500">Aucune saison disponible. Veuillez créer une saison avant de gérer les utilisateurs.</p>
        <Button
          className="mt-4">
          <Link href="/saisons" >
            Gérer les saisons
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>
      <Input
        placeholder="Rechercher un utilisateur..."
        onChange={e => setQuery(e.target.value)}
        className="mb-4 w-1/2"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(results ? results : users)?.map((user: UserUp) => (
          <Card key={user._id} className="relative w-[400px]">
            <CardHeader>
              <CardTitle>{user.name || user.email}</CardTitle>
              <Badge>
                {user.role &&
                  roles?.find((role) => role._id === user.role)?.role}
              </Badge>
              <div className="flex items-center gap-2 mt-2">
                <Dialog open={openDialog === user._id}
                        onOpenChange={open => setOpenDialog(open ? user._id : null)}>
                  <DialogTrigger asChild>
                    <Checkbox
                      checked={!!user.danseuse}
                      disabled={danseusePending}
                      onCheckedChange={() =>
                        handleCheck(user._id, !user.danseuse)
                      }
                      id={`danseuse-${user._id}`}
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle
                      className={"text-xl text-bold"}>{user.danseuse ? "Supprimer le profil danseur" : "Créer un profil danseur"}</DialogTitle>
                    {user.danseuse ? "Etes vous sûr de supprimer la danseuse" :
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4   "
                        >
                          <FormField
                            control={form.control}
                            name="userId"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>User ID</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={true}/>
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nom"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>Nom de scène</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="infos"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>
                                  Informations supplémentaires
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="saisonId"
                            render={({field}) => (
                              <FormItem>
                                <FormLabel>Saison</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder="Choisir une saison"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {saisons?.map((saison: Saison) => (
                                        <SelectItem
                                          key={saison._id}
                                          value={saison._id}
                                        >
                                          {saison.nom}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Créer</Button>
                        </form>
                      </Form>}
                    <DialogFooter>
                      {user.danseuse && (
                        <Button
                          variant="destructive"
                          onClick={() =>
                            setDanseuse({
                              userId: user._id,
                              checked: false,
                              infos: "",
                              nom: "",
                              saisonId: user.danseuse.saisonId,
                            })
                          }
                          disabled={danseusePending}
                        >
                          Supprimer
                        </Button>
                      )}
                      <DialogClose asChild>
                        <Button
                          variant="secondary"
                          disabled={danseusePending}
                        >
                          Annuler
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <label htmlFor={`danseuse-${user._id}`}>Danseuse</label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-muted-foreground">
                Email : {user.email}
              </div>
              <div className="mb-2">
                Rôle actuel :{" "}
                <Badge>
                  {user.role &&
                    roles?.find((role) => role._id === user.role)?.role}
                </Badge>
              </div>
              <Select
                value={user.role}
                onValueChange={(value) =>
                  handleRoleChange(user._id, value as Id<"roles">)
                }
                disabled={assignRolePending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un rôle"/>
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role: Role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
            {user.role === "danseuse" && user.assignations && (
              <CardFooter>
                <div>
                  <div className="font-semibold mb-2">Assignations :</div>
                  <ul className="list-disc ml-4">
                    {user.assignations.map((a: Assignation) => (
                      <li key={a._id}>
                        Tableau : {a.tableau} | Costume : {a.costume} |
                        Accessoire : {a.accessoire}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
