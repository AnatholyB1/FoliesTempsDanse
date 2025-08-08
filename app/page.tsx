"use client";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from 'next/link';
import {Glasses, Loader2, Shirt, SquareArrowOutUpRight, UserCheck, UserX} from "lucide-react";
import {useStoreUserEffect} from "@/hooks/useStoreUserEffect";
import {CreateCostumeDialog} from "@/app/costumes/dialog";
import {CreateAccessoireDialog} from "@/app/accessoires/dialog";
import {useState} from "react";

function UserStatusBar({ isLoading, isAuthenticated }: { isLoading: boolean; isAuthenticated: boolean }) {
    return (
        <div className="w-full flex items-center justify-start  mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--card)] text-[var(--card-foreground)] shadow border border-[var(--border)] min-w-[220px]">
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin text-primary w-5 h-5" />
                        <span className="text-primary font-medium">Chargement...</span>
                    </>
                ) : isAuthenticated ? (
                    <>
                        <UserCheck className="text-primary w-5 h-5" />
                        <span className="font-medium">Connecté</span>
                    </>
                ) : (
                    <>
                        <UserX className="text-destructive w-5 h-5" />
                        <span className="text-destructive font-medium">Non connecté</span>
                    </>
                )}
            </div>
        </div>
    );
}


type DashboardCardProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
};

function DashboardCard({ title, description, href, icon, children  }: DashboardCardProps) {


    return (
        <Card className="min-w-[300px] max-w-[400px] min-h-[320px] flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
                <span className="bg-primary/10 rounded-full p-2">{icon}</span>
                <div className="flex-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <CardAction>
                    <Link href={href} className="text-primary hover:underline" aria-label={`Voir ${title.toLowerCase()}`}>
                        <SquareArrowOutUpRight />
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Aperçu rapide</li>
                    <li>• Gestion et ajout</li>
                    <li>• Statistiques</li>
                </ul>
            </CardContent>
            <CardFooter>
                {children}
            </CardFooter>
        </Card>
    );
}

export default function Home() {

    const [openCostumeDialog, setOpenCostumeDialog] = useState(false);
    const [openAccessoireDialog, setOpenAccessoireDialog] = useState(false);
    const { isLoading, isAuthenticated } = useStoreUserEffect();

    return (
        <div className="min-h-0 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-6">
            <UserStatusBar isLoading={isLoading} isAuthenticated={isAuthenticated} />
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardCard
                    title="Costumes"
                    description="Visualisez, ajoutez et gérez tous vos costumes."
                    href="/costumes"
                    icon={<Shirt className="w-7 h-7 text-primary" />}
                >
                    <CreateCostumeDialog open={openCostumeDialog} onOpenChange={setOpenCostumeDialog} onEdit={(edited)=> setOpenCostumeDialog(!edited)} />
                </DashboardCard>
                <DashboardCard
                    title="Accessoires"
                    description="Visualisez, ajoutez et gérez tous vos accessoires."
                    href="/accessoires"
                    icon={<Glasses className="w-7 h-7 text-primary" />}

                >
                    <CreateAccessoireDialog open={openAccessoireDialog} onOpenChange={setOpenAccessoireDialog} onEdit={(edited) => setOpenAccessoireDialog(!edited)} />
                </DashboardCard>
            </div>
        </div>
    );
}