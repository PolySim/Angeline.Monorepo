"use client";

import { Button } from "@/components/ui/button";
import { useToggleCategoryVisibility } from "@/queries/useCategory";
import { Eye, EyeOff } from "lucide-react";

const ToggleVisibilities = ({
  categoryId,
  disabled,
}: {
  categoryId: string;
  disabled: boolean;
}) => {
  const { mutate: toggleCategoryVisibility, isPending } =
    useToggleCategoryVisibility();

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={() => toggleCategoryVisibility(categoryId)}
      aria-label={
        disabled
          ? "Afficher le reportage sur le site"
          : "Masquer le reportage du site"
      }
    >
      {disabled ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
      {isPending ? "Mise à jour…" : disabled ? "Afficher" : "Masquer"}
    </Button>
  );
};

export default ToggleVisibilities;
