import Image from "next/image";
import Link from "next/link";
import { getCategoriesActive } from "@/action/category.action";
import { portfolioPath } from "@/lib/seo";
import HomeImg from "@/public/home.jpg";

export default async function Home() {
  const categories = await getCategoriesActive();
  const featuredCategories = categories
    .filter((category) => !category.disabled)
    .sort((a, b) => a.ordered - b.ordered)
    .slice(0, 4);

  return (
    <main className="w-screen max-w-6xl mx-auto mt-5 md:mt-10 px-4">
      <div className="w-full">
        <Image
          src={HomeImg}
          alt="Angeline Desdevises - Photographie de guerre et reportage au Moyen-Orient"
          width={1920}
          height={1080}
          priority
          className="w-full h-auto"
        />
      </div>
      <section className="max-w-3xl mt-8 md:mt-10 mb-10 font-helvetica">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-950">
          Angeline Desdevises, photographe documentaire et photojournaliste
        </h1>
        <p className="mt-4 text-sm md:text-base leading-7 text-gray-700">
          Travail documentaire autour des conflits, des territoires et des
          récits humains, avec une attention particulière portée au
          Moyen-Orient, à la Syrie, au Liban, aux portraits et aux publications
          de presse.
        </p>
        {featuredCategories.length > 0 && (
          <nav
            aria-label="Reportages principaux"
            className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold"
          >
            {featuredCategories.map((category) => (
              <Link
                href={portfolioPath(category)}
                className="text-gray-950 underline-offset-4 hover:text-primary hover:underline"
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </main>
  );
}
