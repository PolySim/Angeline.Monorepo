"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PhotoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  blurSrc?: string;
};

export default function GalleryPhoto(props: PhotoProps) {
  return <PhotoAttempt key={props.src} {...props} />;
}

const variantWidths = [384, 640, 1080, 1600] as const;
const nextAttempt = {
  variant: "optimized",
  optimized: "source",
  source: "failed",
} as const;

function PhotoAttempt({ src, alt, width, height, sizes, blurSrc }: PhotoProps) {
  const [attempt, setAttempt] = useState<keyof typeof nextAttempt | "failed">(
    "variant",
  );
  const [loadedAttempt, setLoadedAttempt] = useState<typeof attempt>();
  const loaded = loadedAttempt === attempt;
  const [blurFailed, setBlurFailed] = useState(false);

  return (
    <span
      className={cn("relative block w-full overflow-hidden", !blurSrc && "h-full")}
      style={
        blurSrc && attempt === "failed"
          ? { aspectRatio: `${width} / ${height}` }
          : undefined
      }
    >
      {attempt === "failed" ? (
        <span aria-hidden="true" className="absolute inset-0 bg-neutral-100" />
      ) : (
        <>
          {!loaded && blurSrc && !blurFailed && (
            <>
              <Image
                src={blurSrc}
                alt=""
                aria-hidden="true"
                width={width}
                height={height}
                unoptimized
                loading="lazy"
                onError={() => setBlurFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 backdrop-blur-sm" />
            </>
          )}
          <ResponsiveImage
            key={attempt}
            attempt={attempt}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            onLoad={() => setLoadedAttempt(attempt)}
            onError={() => {
              setAttempt((current) =>
                current === attempt ? nextAttempt[attempt] : current,
              );
            }}
            className={cn(
              "block w-full",
              blurSrc ? "h-auto" : "h-full object-contain",
              !loaded && "opacity-0",
            )}
          />
        </>
      )}
    </span>
  );
}

function ResponsiveImage({
  attempt,
  src,
  alt,
  ...props
}: Omit<PhotoProps, "blurSrc"> & {
  attempt: keyof typeof nextAttempt;
  className: string;
  onLoad: () => void;
  onError: () => void;
}) {
  if (attempt === "variant") {
    const variant = (width: number) => `${src}/variant/v1/${width}`;
    // The API only serves these widths; do not send them through Next's optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      {...props}
      alt={alt}
      ref={(image) => {
        // A cached image request may have settled before React hydrated.
        if (!image?.complete || !image.currentSrc) return;
        if (image.naturalWidth > 0) props.onLoad();
        else props.onError();
      }}
      srcSet={variantWidths.map((width) => `${variant(width)} ${width}w`).join(", ")}
      src={variant(640)}
      loading="lazy"
      decoding="async"
    />;
  }
  return (
    <Image {...props} alt={alt} src={src} unoptimized={attempt === "source"} loading="lazy" />
  );
}
