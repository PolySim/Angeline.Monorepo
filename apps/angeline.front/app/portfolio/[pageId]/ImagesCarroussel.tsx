"use client";

import { config } from "@/config/config";
import { useCategoryById } from "@/queries/useCategory";
import { useImages } from "@/queries/useImage";
import { Image as ImageType } from "@repo/types/entities";
import Image from "next/image";
import React from "react";

const ImagesCarroussel = () => {
  const { data: images } = useImages();
  const { data: category } = useCategoryById();

  const imagesRefactor = (images ?? []).reduce(
    (acc: ImageType[], curr, currentIndex) =>
      currentIndex === 0 && category?.article
        ? [
            ...acc,
            curr,
            {
              id: "article",
              description: category.article ?? "",
              name: "",
              path: "",
              category: "",
              ordered: 0,
            },
          ]
        : [...acc, curr],
    [] as ImageType[]
  );

  return (
    <>
      {imagesRefactor.map((image) => (
        <React.Fragment key={image.id}>
          {image.id === "article" ? (
            <div className="flex justify-center items-center max-h-screen w-screen my-12 snap-center min-w-screen">
              <p className="w-11/12 md:w-10/12 h-fit max-h-[95vh] p-12 text-base text-gray-700 shadow-sm overflow-y-scroll rounded-lg leading-7 bg-white">
                {image.description}
              </p>
            </div>
          ) : (
            <div className="h-screen w-screen bg-transparent snap-center min-w-screen pointer-none:">
              <Image
                className="object-contain h-full w-full"
                src={`${config.IMAGE_URL}/image/${image.id}`}
                alt={`image-${image.name}`}
                width={1920}
                height={1080}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ImagesCarroussel;
