"use client";
export default function Error() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p className="text-muted-foreground">
        Désolé pour le dérangement, veuillez réessayer plus tard.
      </p>
    </div>
  );
}