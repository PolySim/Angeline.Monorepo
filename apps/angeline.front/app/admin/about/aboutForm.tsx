import { FormArea } from "@/components/form/formArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBiography, useUpdateBiography } from "@/queries/useInformation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Information, Lang } from "@repo/types/entities";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  content: z.string().trim().min(1, "Saisissez la biographie."),
});

type FormData = z.infer<typeof formSchema>;

const BiographyForm = ({ information }: { information: Information }) => {
  const { mutate: updateBiography, isPending } = useUpdateBiography();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: information.content,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 rounded-xl border bg-white p-5 sm:p-6"
        onSubmit={form.handleSubmit((data) =>
          updateBiography(
            { lang: information.lang, content: data.content },
            { onSuccess: () => form.reset(data) },
          ),
        )}
      >
        <FormArea
          name="content"
          label={
            information.lang === Lang.FR
              ? "Biographie en français"
              : "Biographie en anglais"
          }
          disabled={isPending}
          className="min-h-64"
        />
        <div className="flex justify-end gap-2 ">
          <Button
            variant="outline"
            type="button"
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
};

export default function AboutForm() {
  const { data: biography = [] } = useBiography();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {biography.map((information) => (
        <BiographyForm key={information.id} information={information} />
      ))}
    </div>
  );
}
