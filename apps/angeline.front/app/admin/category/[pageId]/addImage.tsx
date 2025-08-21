"use client";

import { FormInput } from "@/components/form/formInput";
import { Form } from "@/components/ui/form";
import { useCreateImageByChunks } from "@/queries/useImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  images: z.array(z.instanceof(File)).refine((files) => files.length > 0, {
    message: "Vous devez sélectionner au moins une image",
  }),
});

const AddImage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
    },
  });
  const [isPending, startTransition] = useTransition();
  const { mutate: uploadImagesByChunks } = useCreateImageByChunks();

  const onSubmit = async (data: FileList | null) => {
    if (!data) return;
    startTransition(async () => {
      await Promise.all(
        Array.from(data).map((image) => {
          uploadImagesByChunks(image);
        })
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormInput
          name="images"
          type="file"
          multiple
          accept="image/*"
          onFilesChange={(e) => onSubmit(e.target.files)}
          disabled={isPending}
        />
      </form>
    </Form>
  );
};

export default AddImage;
