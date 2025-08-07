import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from 'next/link';
import {Glasses, Shirt, SquareArrowOutUpRight} from "lucide-react";
import {Button} from "@/components/ui/button";

type DashboardCardProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    buttonLabel: string;
    onButtonClick?: () => void;
};

function DashboardCard({ title, description, href, icon, buttonLabel, onButtonClick }: DashboardCardProps) {
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
                <Button className="w-full" onClick={onButtonClick}>
                    {buttonLabel}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function Home() {
    return (
        <main className="flex flex-row gap-6 items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-200">
            <DashboardCard
                title="Costumes"
                description="Visualisez, ajoutez et gérez tous vos costumes."
                href="/costumes"
                icon={<Shirt className="w-6 h-6 text-primary" />}
                buttonLabel="Nouveau Costume"
            />
            <DashboardCard
                title="Accessoires"
                description="Visualisez, ajoutez et gérez tous vos accessoires."
                href="/accessoires"
                icon={<Glasses className="w-6 h-6 text-primary" />}
                buttonLabel="Nouvel Accessoire"
            />
        </main>
    );
}