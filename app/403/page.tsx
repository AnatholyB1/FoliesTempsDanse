export default function Unauthorized() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Accès refusé</h1>
      <p className="text-muted-foreground">
        Vous n&apos;avez pas la permission d&apos;accéder à cette page.
      </p>
    </div>
  );
}