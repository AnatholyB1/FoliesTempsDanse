export default function NotFound() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Page non trouvée</h1>
        <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n&apos;existe pas.
        </p>
        </div>
    );
}