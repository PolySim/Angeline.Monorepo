import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
  back = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  back?: boolean;
}) {
  return (
    <header className="mb-8 space-y-4">
      {back && (
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tous les reportages
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight break-words">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action && (
          <div className="flex shrink-0 flex-wrap gap-2">{action}</div>
        )}
      </div>
    </header>
  );
}

export function AdminLoading({
  label = "Chargement en cours…",
}: {
  label?: string;
}) {
  return (
    <div role="status" className="space-y-4 py-6">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {label}
      </span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg bg-slate-100"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function AdminError({
  retry,
  message = "Impossible de charger ces informations.",
}: {
  retry: () => void;
  message?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-6"
    >
      <div className="flex items-center gap-2 font-medium text-red-800">
        <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
        {message}
      </div>
      <p className="text-sm text-red-800">
        Vérifiez votre connexion, puis réessayez.
      </p>
      <Button variant="outline" onClick={retry}>
        Réessayer
      </Button>
    </div>
  );
}

export function AdminEmpty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed px-6 py-14 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function SaveStatus({
  pending,
  error,
  dirty = false,
  saved = false,
}: {
  pending?: boolean;
  error?: boolean;
  dirty?: boolean;
  saved?: boolean;
}) {
  return (
    <p
      role="status"
      className={`flex min-h-6 items-center gap-2 text-sm ${error ? "text-red-700" : "text-muted-foreground"}`}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Enregistrement…
        </>
      ) : error ? (
        "Échec de l’enregistrement. Réessayez."
      ) : dirty ? (
        "Modifications non enregistrées"
      ) : saved ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Modifications enregistrées
        </>
      ) : null}
    </p>
  );
}
