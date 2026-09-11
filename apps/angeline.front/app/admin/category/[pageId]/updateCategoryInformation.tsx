"use client";

import { FormArea } from "@/components/form/formArea";
import { FormInput } from "@/components/form/formInput";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCategoryById, useUpdateCategory } from "@/queries/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Saisissez un nom pour le reportage."),
  article: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateCategoryInformation() {
  const { data: category } = useCategoryById();
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      article: category?.article || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          updateCategory(
            { content: data },
            {
              onSuccess: (response) => {
                if (response.success) form.reset(data);
              },
            },
          ),
        )}
        className="space-y-5"
      >
        <FormInput
          name="name"
          label="Nom du reportage"
          placeholder="Nom du reportage"
          required
          disabled={isPending}
        />
        <FormArea
          name="article"
          label="Texte de présentation"
          description="Ce texte apparaît dans le reportage et sert à sa description dans les moteurs de recherche."
          placeholder="Présentez cette série photographique"
          disabled={isPending}
          className="min-h-32"
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <span role="status" className="text-sm text-gray-600">
            {form.formState.isDirty
              ? "Modifications non enregistrées"
              : "À jour"}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || !form.formState.isDirty}
            onClick={() => form.reset()}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
