"use client";

import { FormArea } from "@/components/form/formArea";
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
import { useDeleteImage, useUpdateImageDescription } from "@/queries/useImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageType } from "@repo/types/entities";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({ description: z.string() });

export default function ImageContainer({
  image,
  position,
  count,
  onMove,
  ordering,
}: {
  image: ImageType;
  position: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  ordering: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const update = useUpdateImageDescription();
  const remove = useDeleteImage();
  const pending = update.isPending || remove.isPending;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { description: image.description || "" },
  });
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border bg-white">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-100">
        {imageFailed ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Aperçu indisponible
          </p>
        ) : (
          <Image
            src={`${config.IMAGE_URL}/image/${image.id}`}
            alt={image.description || image.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-contain"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="absolute top-2 left-2 rounded bg-white px-2 py-1 text-xs font-medium tabular-nums">
          {position + 1} / {count}
        </span>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium" title={image.name}>
          {image.name}
        </p>
        <p
          className="mt-1 truncate text-xs text-muted-foreground"
          title={image.description}
        >
          {image.description || "Aucune description"}
        </p>
        <div className="mt-3 flex items-center justify-between gap-1">
          <span
            className={`drag-handle flex size-11 shrink-0 items-center justify-center text-muted-foreground ${ordering ? "pointer-events-none" : ""}`}
            aria-hidden="true"
          >
            <GripVertical className="size-5" />
          </span>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              disabled={ordering || position === 0}
              aria-label={`Avancer ${image.name}`}
              title="Avancer dans la galerie"
              onClick={() => onMove(-1)}
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={ordering || position === count - 1}
              aria-label={`Reculer ${image.name}`}
              title="Reculer dans la galerie"
              onClick={() => onMove(1)}
            >
              <ArrowDown className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <Dialog
            open={open}
            onOpenChange={(value) => {
              if (pending) return;
              setOpen(value);
              setConfirmDelete(false);
              update.reset();
              remove.reset();
              form.reset({ description: image.description || "" });
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={ordering}
                aria-label={`Modifier l’image ${image.name}`}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent
              closeLabel="Fermer"
              className="admin-ui admin-dialog"
              showCloseButton={!pending}
            >
              <DialogHeader>
                <DialogTitle>
                  {confirmDelete
                    ? "Supprimer cette image ?"
                    : "Modifier l’image"}
                </DialogTitle>
                <DialogDescription className="break-words">
                  {confirmDelete
                    ? `L’image « ${image.name} » sera supprimée définitivement du reportage.`
                    : image.name}
                </DialogDescription>
              </DialogHeader>
              {confirmDelete ? (
                <>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Cette action ne peut pas être annulée.
                  </p>
                  {remove.isError && (
                    <p role="alert" className="text-sm text-red-700">
                      La suppression a échoué. Réessayez.
                    </p>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      disabled={pending}
                      onClick={() => setConfirmDelete(false)}
                    >
                      Conserver l’image
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={pending}
                      onClick={() =>
                        remove.mutate(image.id, {
                          onSuccess: () => setOpen(false),
                        })
                      }
                    >
                      {pending ? "Suppression…" : "Supprimer définitivement"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <Form {...form}>
                  <form
                    className="space-y-5"
                    onSubmit={form.handleSubmit((values) =>
                      update.mutate(
                        { imageId: image.id, description: values.description },
                        { onSuccess: () => setOpen(false) },
                      ),
                    )}
                  >
                    <FormArea
                      name="description"
                      label="Description de l’image"
                      description="Décrivez le sujet et le contexte de la photographie."
                      className="min-h-32"
                      disabled={pending}
                    />
                    {update.isError && (
                      <p role="alert" className="text-sm text-red-700">
                        La description n’a pas été enregistrée. Réessayez.
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                      <Button
                        variant="ghost"
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirmDelete(true)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Supprimer
                      </Button>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            type="button"
                            disabled={pending}
                          >
                            Annuler
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}>
                          {pending ? "Enregistrement…" : "Enregistrer"}
                        </Button>
                      </DialogFooter>
                    </div>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}
