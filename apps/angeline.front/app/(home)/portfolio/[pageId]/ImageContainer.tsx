"use client";

import type { Category, Image } from "@repo/types/entities";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ImagesCarroussel from "./ImagesCarroussel";

const ImageContainer = ({
  children,
  category,
  imageId,
  images,
  label,
}: {
  children: React.ReactNode;
  category: Category;
  imageId: string;
  images: Image[];
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const onOpen = () => {
    const index = Math.max(images.findIndex((image) => image.id === imageId), 0);
    const slideIndex =
      imageId === "article" ? 1 : index + (index > 0 && category.article ? 1 : 0);
    const element = containerRef.current;
    if (element) element.scrollLeft = slideIndex * element.clientWidth;
    closeRef.current?.focus({ preventScroll: true });
    setIsPositioned(true);
  };

  const onNavigate = (direction: -1 | 1) => {
    const element = containerRef.current;
    if (element) element.scrollLeft += direction * element.clientWidth;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsPositioned(false);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="group flex flex-col items-stretch relative w-full aspect-video text-left cursor-pointer hover:scale-[0.98] transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 [&>*]:shrink-0"
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        onContextMenu={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          onOpen();
        }}
        onKeyDown={(e) => {
          if (!isOpen || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) {
            return;
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            onNavigate(e.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        showCloseButton={false}
        className="top-0 left-0 h-screen translate-x-0 translate-y-0 block p-0 m-0 rounded-none border-0 gap-0 bg-transparent"
      >
        <DialogTitle className="sr-only">{category.name || "Images"}</DialogTitle>
        <DialogClose asChild>
          <Button
            ref={closeRef}
            aria-label="Fermer la galerie"
            size="icon"
            variant="ghost"
            className="absolute top-4 left-4 w-10 h-10 z-10 cursor-pointer bg-black/10 backdrop-blur-[10px] pointer-events-auto rounded-xl p-2 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:scale-105"
          >
            <XIcon className="text-white" />
          </Button>
        </DialogClose>
        {(images.length > 1 || category.article) && (
          <>
            <Button
              aria-label="Diapositive précédente"
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(-1)}
              className="absolute top-1/2 left-4 -translate-y-1/2 z-10 pointer-events-auto hover:bg-primary/30"
            >
              <ChevronLeft className="text-white size-10" />
            </Button>
            <Button
              aria-label="Diapositive suivante"
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(1)}
              className="absolute top-1/2 right-4 -translate-y-1/2 z-10 pointer-events-auto hover:bg-primary/30"
            >
              <ChevronRight className="text-white size-10" />
            </Button>
          </>
        )}
        <div
          ref={containerRef}
          className={cn(
            "flex h-full w-full overflow-x-auto snap-x snap-mandatory disable_scrollbar",
            isPositioned && "motion-safe:scroll-smooth",
          )}
        >
          <ImagesCarroussel category={category} images={images} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageContainer;
