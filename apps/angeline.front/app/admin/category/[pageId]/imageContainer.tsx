"use client";

import { FormInput } from "@/components/form/formInput";
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
import { Form } from "@/components/ui/form";
import { config } from "@/config/config";
import { cn } from "@/lib/utils";
import { useDeleteImage, useUpdateImageDescription } from "@/queries/useImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageType } from "@repo/types/entities";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  description: z.string().trim(),
});

type FormSchema = z.infer<typeof formSchema>;

const ImageContainer = ({ image }: { image: ImageType }) => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ratio, setRatio] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const calculRatio = () => {
    if (
      imageRef.current?.height &&
      imageRef.current?.width &&
      imageRef.current.height > imageRef.current.width
    ) {
      setRatio(2);
    } else {
      setRatio(1);
    }
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: image.description || "",
    },
  });

  const { mutate: updateImageDescription, isPending: isSaving } =
    useUpdateImageDescription();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();
  const busy = isSaving || isDeleting;

  const onSubmit = async () => {
    updateImageDescription(
      {
        imageId: image.id,
        description: form.getValues("description"),
      },
      {
        onSuccess: () => {
          form.reset(form.getValues());
          setOpen(false);
        },
      },
    );
  };

  const onDelete = async () => {
    deleteImage(image.id, { onSuccess: () => setOpen(false) });
  };

  return (
    <div
      className={cn("relative", {
        "row-span-2": ratio === 2,
      })}
    >
      <Image
        src={`${config.IMAGE_URL}/image/${image.id}`}
        alt={image.description || image.name}
        width={500}
        height={325}
        ref={imageRef}
        onLoad={calculRatio}
        sizes="(max-width: 768px) 45vw, 350px"
        className="w-full h-auto cursor-grab"
      />
      <div className="py-3">
        <p className="text-sm text-gray-600 truncate mb-2">
          {image.description || "Sans légende"}
        </p>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            if (!busy) {
              setOpen(value);
              setConfirmDelete(false);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              Modifier<span className="sr-only"> {image.name}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {confirmDelete
                  ? "Supprimer cette photographie ?"
                  : "Modifier la photographie"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {confirmDelete
                ? "Cette suppression est définitive."
                : "La légende décrit la photographie pour les visiteurs et les moteurs de recherche."}
            </DialogDescription>
            <Form {...form}>
              <form
                id={`edit-image-${image.id}`}
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full px-4"
              >
                <FormInput
                  name="description"
                  label="Légende"
                  placeholder="Décrivez le sujet, le lieu et le contexte"
                  disabled={busy || confirmDelete}
                />
              </form>
            </Form>
            <DialogFooter>
              <Button
                variant="destructive"
                type="button"
                disabled={busy}
                onClick={() =>
                  confirmDelete ? onDelete() : setConfirmDelete(true)
                }
              >
                {isDeleting
                  ? "Suppression…"
                  : confirmDelete
                    ? "Supprimer définitivement"
                    : "Supprimer la photographie"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={busy}>
                  Annuler
                </Button>
              </DialogClose>
              {!confirmDelete && (
                <Button
                  type="submit"
                  form={`edit-image-${image.id}`}
                  disabled={busy || !form.formState.isDirty}
                  className="bg-gray-950 text-white hover:bg-gray-800"
                >
                  {isSaving ? "Enregistrement…" : "Enregistrer"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageContainer;
