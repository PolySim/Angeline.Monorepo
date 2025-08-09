"use client";

import { config } from "@/config/config";
import { cn } from "@/lib/utils";
import { Image as ImageType } from "@repo/types/entities";
import Image from "next/image";
import { useState } from "react";
import ImageContainer from "./ImageContainer";

const ImageElement = ({ image }: { image: ImageType }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ImageContainer imageId={image.id}>
      <div
        className="overflow-hidden relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        {!isLoaded && (
          <>
            <Image
              src={`${config.IMAGE_URL}/image/${image.id}/blur`}
              alt={`image_${image.id}`}
              width={500}
              height={325}
              unoptimized
              priority
              className="w-full"
            />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </>
        )}
        <Image
          src={`${config.IMAGE_URL}/image/${image.id}`}
          alt={`image_${image.id}`}
          width={500}
          height={325}
          onLoadingComplete={() => setIsLoaded(true)}
          loading="lazy"
          className={cn("w-full h-auto", {
            "absolute top-0 left-0 -z-10": !isLoaded,
          })}
        />
        {image.description && image.description !== "" && (
          <span className="flex justify-center bg-white/50 w-full text-center py-2 opacity-0 group-hover:opacity-100 transition -translate-y-1/2 group-hover:-translate-y-full backdrop-blur-md">
            {image.description}
          </span>
        )}
      </div>
    </ImageContainer>
  );
};

export default ImageElement;
