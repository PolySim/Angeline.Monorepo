"use client";

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
import { config } from "@/config/config";
import { cn } from "@/lib/utils";
import { useDeleteImage, useUpdateImageDescription } from "@/queries/useImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageType } from "@repo/types/entities";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  description: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

const ImageContainer = ({ image }: { image: ImageType }) => {
  const [ratio, setRatio] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const calculRatio = () => {
    if (
      imageRef.current?.height &&
      imageRef.current?.width &&
      imageRef.current.height > imageRef.current.width
    ) {
      setRatio(2);
    } else {
      setRatio(1);
    }
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: image.description || "",
    },
  });

  const { mutate: updateImageDescription } = useUpdateImageDescription();
  const { mutate: deleteImage } = useDeleteImage();

  const onSubmit = async () => {
    updateImageDescription({
      imageId: image.id,
      description: form.getValues("description"),
    });
  };

  const onDelete = async () => {
    deleteImage(image.id);
  };

  return (
    <div
      className={cn("relative", {
        "row-span-2": ratio === 2,
      })}
    >
      <Image
        src={`${config.IMAGE_URL}/image/${image.id}`}
        alt={`image_${image.name}`}
        width={500}
        height={325}
        ref={imageRef}
        onLoadingComplete={calculRatio}
        className="w-full h-auto cursor-grab"
      />
      <div className="absolute top-0 bottom-0 left-0 right-0 opacity-0 hover:opacity-100 bg-black/40 flex justify-center items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit image</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit description</DialogTitle>
            </DialogHeader>
            <DialogDescription />
            <Form {...form}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full px-4"
              >
                <FormInput
                  name="description"
                  label="Description"
                  placeholder="Description"
                />
              </form>
            </Form>
            <DialogFooter>
              <Button variant="destructive" type="button" onClick={onDelete}>
                Supprimer l&apos;image
              </Button>
              <DialogClose asChild>
                <Button type="button" onClick={onSubmit}>
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageContainer;
