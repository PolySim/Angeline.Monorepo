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
  const { mutate: toggleCategoryVisibility } = useToggleCategoryVisibility();

  return (
    <Button
      size="icon"
      onClick={() => toggleCategoryVisibility(categoryId)}
      className={`p-2 rounded-md transition-colors bg-transparent shadow-none ${
        !disabled
          ? "text-orange-600 hover:bg-orange-50"
          : "text-green-600 hover:bg-green-50"
      }`}
      title={disabled ? "Désactiver" : "Activer"}
    >
      {disabled ? <EyeOff size={18} /> : <Eye size={18} />}
    </Button>
  );
};

export default ToggleVisibilities;
