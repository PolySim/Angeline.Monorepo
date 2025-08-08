"use client";

import { useCategoriesActive } from "@/queries/useCategory.queries";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const MenuDesktop = () => {
  const { data: categories, isPending } = useCategoriesActive();

  const categoriesFiltered = categories?.filter(
    (category) => ![1, 2, 3].includes(category.ordered)
  );

  return (
    <div className="hidden md:flex flex-wrap gap-y-6 justify-center items-center w-9/12 mt-8 mx-auto font-bold font-helvetica text-md text-center">
      <Link
        href={`/portfolio/${categories?.find((category) => category.ordered === 3)?.id}`}
        className="hover:text-primary transition"
      >
        PORTFOLIO
      </Link>
      <span className="opacity-15 text-40 mx-6 ">⚫</span>
      <div className="flex flex-col relative group z-20">
        <p className="group-hover:text-primary transition">REPORTAGE</p>
        <div className="hidden absolute w-max rounded-b-lg top-0 mt-5 p-1 pt-3 -left-3 text-left group-hover:flex flex-col gap-1 bg-white">
          {isPending ? (
            <div className="flex justify-center items-center h-full w-full min-w-32 min-h-10">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            (categoriesFiltered || []).map((category) => (
              <Link
                key={category.id}
                href={`/portfolio/${category.id}`}
                className="hover:bg-primary/20 transition px-3 py-0.5 rounded-md"
              >
                {category.name}
              </Link>
            ))
          )}
        </div>
      </div>
      <span className="opacity-15 text-40 mx-6 ">⚫</span>
      <Link
        href={`/portfolio/${categories?.find((category) => category.ordered === 1)?.id}`}
        className="hover:text-primary transition"
      >
        PORTRAITS
      </Link>
      <span className="opacity-15 text-40 mx-6 ">⚫</span>
      <Link
        href={`/portfolio/${categories?.find((category) => category.ordered === 2)?.id}`}
        className="hover:text-primary transition"
      >
        PUBLICATIONS
      </Link>
      <span className="opacity-15 text-40 mx-6 ">⚫</span>
      <Link href="/contact" className="hover:text-primary transition">
        CONTACT
      </Link>
      <span className="opacity-15 text-40 mx-6 ">⚫</span>
      <Link href="/apropos" className="hover:text-primary transition">
        A PROPOS
      </Link>
    </div>
  );
};

export default MenuDesktop;
