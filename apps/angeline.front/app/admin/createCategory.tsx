"use client";

import { FormArea } from "@/components/form/formArea";
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
import { useCreateCategory } from "@/queries/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Saisissez un nom pour le reportage."),
  article: z.string(),
});

export default function CreateCategory() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", article: "" },
  });
  const { mutate: createCategory, isPending } = useCreateCategory();
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (isPending) return;
        setOpen(value);
        if (!value) {
          form.reset();
          setFailed(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          Créer un reportage
        </Button>
      </DialogTrigger>
      <DialogContent
        closeLabel="Fermer"
        className="admin-ui admin-dialog"
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <DialogTitle>Créer un reportage</DialogTitle>
          <DialogDescription>
            Ajoutez un titre. Vous pourrez ensuite compléter l’article et
            importer vos images.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            noValidate
            onSubmit={form.handleSubmit((values) => {
              setFailed(false);
              createCategory(values, {
                onSuccess: (result) => {
                  if (result.success) {
                    setOpen(false);
                    form.reset();
                  } else setFailed(true);
                },
                onError: () => setFailed(true),
              });
            })}
          >
            <FormInput
              name="name"
              label="Nom"
              placeholder="Nom du reportage"
              disabled={isPending}
              required
            />
            <FormArea
              name="article"
              label="Article (facultatif)"
              className="min-h-36"
              disabled={isPending}
            />
            {failed && (
              <p role="alert" className="text-sm text-red-700">
                Le reportage n’a pas été créé. Vos textes sont conservés ;
                réessayez.
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" disabled={isPending} variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                {isPending ? "Création…" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
