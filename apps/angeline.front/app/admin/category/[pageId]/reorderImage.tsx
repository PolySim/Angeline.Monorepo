"use client";

import useDebounce from "@/hook/useDebonce";
import { useImages, useReorderImages } from "@/queries/useImage";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { Image as ImageType } from "@repo/types/entities";
import { useEffect } from "react";
import ImageContainer from "./imageContainer";

const ReorderImage = () => {
  const { data: images } = useImages();
  const [parent, imagesSorted, setImages] = useDragAndDrop<
    HTMLDivElement,
    ImageType
  >(images || [], {
    handleEnd: () => onEnd(imagesSorted),
  });

  useEffect(() => {
    setImages(images || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images?.length]);

  const { mutate: reorderImages } = useReorderImages({
    onErrorCallback: () => {
      setImages(images || []);
    },
  });

  const onReorder = (lastImages: ImageType[]) => {
    if (lastImages.some((image, i) => image.id !== imagesSorted[i].id)) return;
    reorderImages(lastImages.map((image) => image.id));
  };

  const onEnd = useDebounce(onReorder, 500);

  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-3 justify-center items-stretch w-full max-w-6xl mx-auto p-4"
      ref={parent}
    >
      {imagesSorted.map((image) => (
        <ImageContainer key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ReorderImage;
