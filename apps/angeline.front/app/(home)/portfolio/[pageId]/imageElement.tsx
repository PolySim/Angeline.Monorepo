"use client";

import type { Category, Image as ImageType } from "@repo/types/entities";
import { config } from "@/config/config";
import GalleryPhoto from "./GalleryPhoto";
import ImageContainer from "./ImageContainer";

const ImageElement = ({
  category,
  image,
  images,
}: {
  category: Category;
  image: ImageType;
  images: ImageType[];
}) => {
  const src = `${config.IMAGE_URL}/image/${image.id}`;
  const alt =
    image.description ||
    image.name ||
    "Photographie reportage Angeline Desdevises";

  return (
    <ImageContainer
      category={category}
      imageId={image.id}
      images={images}
      label={`Agrandir : ${alt}`}
    >
      <span
        className="block overflow-hidden relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        <GalleryPhoto
          src={src}
          blurSrc={`${src}/blur`}
          alt={alt}
          width={500}
          height={325}
          sizes="(max-width: 768px) 50vw, (max-width: 1152px) 33vw, 368px"
        />
        {image.description && (
          <span className="flex justify-center bg-white/50 w-full text-center py-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition -translate-y-1/2 group-hover:-translate-y-full group-focus-visible:-translate-y-full backdrop-blur-md">
            {image.description}
          </span>
        )}
      </span>
    </ImageContainer>
  );
};

export default ImageElement;
