"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteCategory } from "@/queries/useCategory";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteCategory({
  categoryId,
  name,
}: {
  categoryId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const {
    mutate: deleteCategory,
    isPending,
    isError,
    reset,
  } = useDeleteCategory();
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          setOpen(value);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-700 hover:bg-red-50 hover:text-red-800"
          aria-label={`Supprimer ${name}`}
          title={`Supprimer ${name}`}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent
        closeLabel="Fermer"
        className="admin-ui admin-dialog"
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <DialogTitle>Supprimer ce reportage ?</DialogTitle>
          <DialogDescription className="break-words">
            Le reportage « {name} » sera supprimé. Cette action est définitive.
          </DialogDescription>
        </DialogHeader>
        {isError && (
          <p role="alert" className="text-sm text-red-700">
            La suppression a échoué. Réessayez.
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Annuler
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              deleteCategory(categoryId, { onSuccess: () => setOpen(false) })
            }
          >
            {isPending && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {isPending ? "Suppression…" : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
