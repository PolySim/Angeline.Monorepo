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
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Saisissez un nom pour le reportage."),
  article: z.string(),
});

export default function CreateCategory() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      article: "",
    },
  });
  const { mutate: createCategory, isPending } = useCreateCategory();

  return (
    <Dialog onOpenChange={(open) => !open && form.reset()}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-bold">
          Créer un reportage
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 max-w-6xl">
        <DialogHeader>
          <DialogTitle>Créer un reportage</DialogTitle>
          <DialogDescription>
            Donnez un nom à votre série, puis ajoutez ses photographies.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-report"
            className="flex flex-col gap-4 w-full"
            onSubmit={form.handleSubmit((data) => createCategory(data))}
          >
            <div className="w-full">
              <FormInput
                name="name"
                label="Nom"
                disabled={isPending}
                required
              />
            </div>
            <div className="w-full">
              <FormArea
                name="article"
                label="Texte de présentation (facultatif)"
                disabled={isPending}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="create-report"
            disabled={isPending}
            className="bg-gray-950 text-white hover:bg-gray-800"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
