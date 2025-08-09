"use client";

import { FormArea } from "@/components/form/formArea";
import { FormInput } from "@/components/form/formInput";
import { Form } from "@/components/ui/form";
import useDebounce from "@/hook/useDebonce";
import { useCategoryById, useUpdateCategory } from "@/queries/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  article: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateCategoryInformation() {
  const { data: category } = useCategoryById();
  const { mutate: updateCategory } = useUpdateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      article: category?.article || "",
    },
  });

  const onValid = ({
    type,
    value,
  }: {
    type: "name" | "article";
    value: string;
  }) => {
    if (form.getValues(type) !== value) return;

    updateCategory({
      content: { [type]: value },
    });
  };

  const onChange = useDebounce(
    ({ type, value }: { type: "name" | "article"; value: string }) => {
      onValid({ type, value });
    },
    500
  );

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 items-start"
      >
        <FormInput
          name="name"
          label="Nom du reportage"
          placeholder="Nom du reportage"
          required
          onChange={(value) => onChange({ type: "name", value })}
        />
        <FormArea
          name="article"
          label="Article"
          placeholder="Article"
          onChange={(value) => onChange({ type: "article", value })}
        />
      </form>
    </Form>
  );
}
