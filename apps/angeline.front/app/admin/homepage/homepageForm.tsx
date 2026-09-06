"use client";

import { FormArea } from "@/components/form/formArea";
import { FormInput } from "@/components/form/formInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUpdateHomepageSettings } from "@/queries/useHomepageSettings";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomepageSettings } from "@repo/types/entities";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  visible: z.boolean(),
  title: z.string().trim().min(1, "Le titre est obligatoire").max(120),
  content: z.string().trim().min(1, "Le texte est obligatoire").max(500),
});

type FormData = z.infer<typeof formSchema>;

export default function HomepageForm({
  settings,
}: {
  settings: HomepageSettings;
}) {
  const { mutate: updateSettings, isPending } = useUpdateHomepageSettings();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visible: settings.visible,
      title: settings.title,
      content: settings.content,
    },
  });

  const onSubmit = (data: FormData) => {
    updateSettings(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          form.reset(response.data);
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-start gap-3">
          <input
            id="homepage-visible"
            type="checkbox"
            className="mt-1 size-4 accent-gray-950"
            {...form.register("visible")}
          />
          <div>
            <label
              htmlFor="homepage-visible"
              className="font-medium text-gray-950"
            >
              Afficher le contenu éditorial
            </label>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Désactivé, l’accueil affiche uniquement la photographie.
            </p>
          </div>
        </div>

        <FormInput
          name="title"
          label="Titre"
          description="Titre principal affiché sous la photographie."
          placeholder="Titre de la page d’accueil"
        />
        <FormArea
          name="content"
          label="Texte de présentation"
          description="Les quatre premiers reportages visibles apparaissent ensuite automatiquement."
          placeholder="Présentation du travail photographique"
          className="min-h-32"
        />

        <div className="flex justify-end gap-2">
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
