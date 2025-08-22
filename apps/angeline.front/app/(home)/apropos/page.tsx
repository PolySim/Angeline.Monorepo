"use client";

import AboutImg from "@/public/about.jpeg";
import { useBiography } from "@/queries/useInformation";
import { Lang } from "@repo/types/entities";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const { data: biography, isPending } = useBiography();
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 w-full max-w-7xl mx-auto p-8 md:p-10">
      <div className="md:sticky top-6 w-full h-max">
        <Image
          src={AboutImg}
          width={568}
          height={852}
          alt="Angeline Desdevises"
          className="w-full"
        />
      </div>
      <div className="text-gray-600 font-helvetica">
        <h1 className="text-gray-900 text-4xl md:text-6xl font-bold">
          Biographie (fr)
        </h1>
        {isPending ? (
          <div className="flex justify-center items-center h-full w-full min-w-32 min-h-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="text-xs font-medium text-gray-600 mt-3 md:mt-5 leading-5">
            {biography
              ?.find((info) => info.lang === Lang.FR)
              ?.content.split("\n")
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        )}
        <h4 className="mt-6 text-lg md:text-2xl font-semibold">
          Biography (en)
        </h4>
        {isPending ? (
          <div className="flex justify-center items-center h-full w-full min-w-32 min-h-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="text-xs font-medium text-gray-600 mt-3 leading-5">
            {biography
              ?.find((info) => info.lang === Lang.EN)
              ?.content.split("\n")
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
