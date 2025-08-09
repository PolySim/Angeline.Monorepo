"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteCategory } from "@/queries/useCategory";
import { Trash2 } from "lucide-react";

const DeleteCategory = ({ categoryId }: { categoryId: string }) => {
  const { mutate: deleteCategory } = useDeleteCategory();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent shadow-none"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Supprimer le reportage</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => deleteCategory(categoryId)}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategory;
