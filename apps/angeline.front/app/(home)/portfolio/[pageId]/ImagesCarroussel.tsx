"use client";

import type { Category, Image as ImageType } from "@repo/types/entities";
import React from "react";
import { config } from "@/config/config";
import GalleryPhoto from "./GalleryPhoto";

const ImagesCarroussel = ({
  category,
  images,
}: {
  category: Category;
  images: ImageType[];
}) => {
  const imagesRefactor = images.reduce(
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
    [] as ImageType[],
  );

  return (
    <>
      {imagesRefactor.map((image) => (
        <React.Fragment key={image.id}>
          {image.id === "article" ? (
            <div className="flex justify-center items-center max-h-screen w-full my-12 snap-center shrink-0">
              <p className="w-11/12 md:w-10/12 h-fit max-h-[95vh] p-12 text-base text-gray-700 shadow-sm overflow-y-scroll rounded-lg leading-7 bg-white">
                {image.description}
              </p>
            </div>
          ) : (
            <div className="h-full w-full shrink-0 bg-transparent snap-center">
              <GalleryPhoto
                src={`${config.IMAGE_URL}/image/${image.id}`}
                alt={
                  image.description ||
                  image.name ||
                  "Photographie documentaire d'Angeline Desdevises"
                }
                width={1920}
                height={1080}
                sizes="100vw"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ImagesCarroussel;
