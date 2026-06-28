"use client";

import type { Category, Image } from "@repo/types/entities";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ImagesCarroussel from "./ImagesCarroussel";

const FixedCloseButton = ({ onClose }: { onClose: () => void }) => {
  return createPortal(
    <Button
      onClick={() => {
        onClose();
      }}
      size="icon"
      variant="ghost"
      className="fixed top-4 left-4 w-10 h-10 z-[100000000] cursor-pointer bg-black/10 backdrop-blur-[10px] pointer-events-auto rounded-xl p-2 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:scale-105"
    >
      <XIcon className="text-white" />
    </Button>,
    document.body,
  );
};

const NavigateButton = ({
  onNavigate,
}: {
  onNavigate: (left: boolean) => void;
}) => {
  return createPortal(
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(true)}
        className="fixed top-1/2 left-4 -translate-y-1/2 z-[100000000] pointer-events-auto hover:bg-primary/30"
      >
        <ChevronLeft className="text-white size-10" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate(false)}
        className="fixed top-1/2 right-4 -translate-y-1/2 z-[100000000] pointer-events-auto hover:bg-primary/30"
      >
        <ChevronRight className="text-white size-10" />
      </Button>
    </>,
    document.body,
  );
};

const ImageContainer = ({
  children,
  category,
  imageId,
  images,
}: {
  children: React.ReactNode;
  category: Category;
  imageId: string;
  images: Image[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onOpen = () => {
    const index = images.findIndex((image) => image.id === imageId);
    const safeIndex = Math.max(index, 0);
    const imageIndex =
      imageId === "article"
        ? 1
        : safeIndex === 0 || !category?.article
          ? safeIndex
          : safeIndex + 1;

    const element = containerRef.current;
    if (element) {
      element.scrollLeft = imageIndex * window.innerWidth;
    }
    setIsOpened(true);
  };

  const onNavigate = (left: boolean) => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollLeft += left ? -window.innerWidth : window.innerWidth;
  };

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      const element = containerRef.current;
      if (!element) return;
      switch (e.key) {
        case "ArrowLeft":
          onNavigate(true);
          break;
        case "ArrowRight":
          onNavigate(false);
          break;
      }
    };

    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  });

  return (
    <Dialog
        open={isOpen}
        onOpenChange={(newOpen) => {
          setIsOpen(newOpen);
          if (!newOpen) {
            setIsOpened(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video cursor-pointer hover:scale-[0.98] transition duration-150">
            {children}
          </div>
        </DialogTrigger>
        <DialogContent
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            onOpen();
          }}
          showCloseButton={false}
          ref={containerRef}
          className={cn(
            "p-0 m-0 rounded-none overflow-x-auto snap-x snap-mandatory disable_scrollbar flex bg-transparent",
            {
              "scroll-smooth": isOpened,
            },
          )}
        >
          {isOpen && <FixedCloseButton onClose={() => setIsOpen(false)} />}
          {isOpened && isOpen && <NavigateButton onNavigate={onNavigate} />}
          <DialogHeader className="sr-only">
            <DialogTitle>{category?.name ?? "Images"}</DialogTitle>
          </DialogHeader>
          <ImagesCarroussel category={category} images={images} />
        </DialogContent>
      </Dialog>
  );
};

export default ImageContainer;
