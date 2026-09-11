"use client";

import { Button } from "@/components/ui/button";
import { useToggleCategoryVisibility } from "@/queries/useCategory";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ToggleVisibilities({
  categoryId,
  disabled,
  name,
}: {
  categoryId: string;
  disabled: boolean;
  name: string;
}) {
  const { mutate: toggle, isPending } = useToggleCategoryVisibility();
  const label = `${disabled ? "Afficher" : "Masquer"} ${name}`;
  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={isPending}
      onClick={() => toggle(categoryId)}
      aria-label={disabled ? "Afficher le reportage sur le site" : "Masquer le reportage du site"}
      title={label}
      className="text-muted-foreground"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : disabled ? (
        <Eye className="size-4" aria-hidden="true" />
      ) : (
        <EyeOff className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
