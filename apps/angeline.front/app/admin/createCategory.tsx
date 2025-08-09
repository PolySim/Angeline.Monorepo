"use client";

import { FormArea } from "@/components/form/formArea";
import { FormInput } from "@/components/form/formInput";
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
import { Form } from "@/components/ui/form";
import { useCreateCategory } from "@/queries/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  article: z.string().min(1),
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
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex gap-4 w-full"
            onSubmit={(e) => e.preventDefault()}
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
              <FormArea name="article" label="Article" disabled={isPending} />
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
            disabled={isPending}
            onClick={() => createCategory(form.getValues())}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
