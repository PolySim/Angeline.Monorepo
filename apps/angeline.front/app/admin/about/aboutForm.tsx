import { FormArea } from "@/components/form/formArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBiography, useUpdateBiography } from "@/queries/useInformation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lang } from "@repo/types/entities";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  contentFR: z.string().min(1),
  contentUS: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const AboutForm = () => {
  const { data: biography } = useBiography();
  const { mutate: updateBiography, isPending } = useUpdateBiography();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentFR:
        biography?.find((item) => item.lang === Lang.FR)?.content || "",
      contentUS:
        biography?.find((item) => item.lang === Lang.EN)?.content || "",
    },
  });

  const onReset = (lang: Lang) => {
    form.setValue(
      lang === Lang.FR ? "contentFR" : "contentUS",
      biography?.find((item) => item.lang === lang)?.content || ""
    );
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormArea name="contentFR" label="Biographie FR" />
        <div className="flex justify-end gap-2 ">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => onReset(Lang.FR)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() =>
              updateBiography({
                lang: Lang.FR,
                content: form.getValues("contentFR"),
              })
            }
          >
            Enregistrer
          </Button>
        </div>
        <FormArea name="contentUS" label="Biographie US" />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={isPending}
            type="button"
            onClick={() => onReset(Lang.EN)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() =>
              updateBiography({
                lang: Lang.EN,
                content: form.getValues("contentUS"),
              })
            }
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AboutForm;
