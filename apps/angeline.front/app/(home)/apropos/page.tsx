import { Lang } from "@repo/types/entities";
import Image from "next/image";
import { getBiography } from "@/action/information.action";
import { cn } from "@/lib/utils";
import AboutImg from "@/public/portrait.jpg";

const renderParagraphs = (content?: string) =>
  content?.split("\n").map((line, index) => (
    <p
      className={cn({
        "min-h-2": line === "",
      })}
      key={`${index}-${line}`}
    >
      {line}
    </p>
  ));

export default async function AboutPage() {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);
  const biographyEn = biography?.find((info) => info.lang === Lang.EN);

  return (
    <main className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 w-full max-w-7xl mx-auto p-8 md:p-10">
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
        <div className="text-xs font-medium text-gray-600 mt-3 md:mt-5 leading-5">
          {renderParagraphs(biographyFr?.content)}
        </div>
        <h2 className="mt-6 text-lg md:text-2xl font-semibold">
          Biography (en)
        </h2>
        <div className="text-xs font-medium text-gray-600 mt-3 leading-5">
          {renderParagraphs(biographyEn?.content)}
        </div>
      </div>
    </main>
  );
}
