"use client";

import type { Category, Image } from "@repo/types/entities";
import React from "react";
import { useWindowSizeStore } from "@/store/windowSize.store";
import ImageContainer from "./ImageContainer";
import ImageElement from "./imageElement";

const MediaGrid = ({
  category,
  images,
}: {
  category: Category;
  images: Image[];
}) => {
  const cols = useWindowSizeStore((state) => (state.width <= 768 ? 2 : 3));

  const imagesRefactor = images.reduce(
    (acc: Image[], curr, currentIndex) =>
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
    [] as Image[],
  );

  const imagesArray: Image[][] = imagesRefactor.reduce(
    (acc, curr, currentIndex) => {
      const index = currentIndex % cols;
      if (acc.length < index + 1) {
        return [...acc, [curr]];
      }
      return acc.map((row, rowIndex) =>
        rowIndex === index ? [...row, curr] : row,
      );
    },
    [] as Image[][],
  );

  const shortText: (text: string) => string = (text) => {
    const words = text.split(" ");
    words.pop();
    const shortText = words.splice(0, 17).join(" ");

    return shortText + "...";
  };

  return (
    <div className="mt-4 md:mt-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 justify-center items-stretch w-screen max-w-6xl mx-auto p-4">
        {imagesArray.map((col, colIndex) => (
          <div className="flex flex-col gap-4 w-full" key={colIndex}>
            {col.map((image) => (
              <React.Fragment key={image.id}>
                {image.id === "article" ? (
                  <ImageContainer
                    category={category}
                    imageId={image.id}
                    images={images}
                  >
                    <div className="flex flex-col justify-center items-center w-full aspect-video">
                      <p className="w-10/12 text-md text-gray-700">
                        {shortText(image.description ?? "")}
                      </p>
                      <p className="mt-2 pt-6 font-bold text-sm text-black">
                        READ MORE
                      </p>
                    </div>
                  </ImageContainer>
                ) : (
                  <ImageElement
                    category={category}
                    image={image}
                    images={images}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGrid;
