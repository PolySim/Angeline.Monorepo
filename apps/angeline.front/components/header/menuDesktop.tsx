"use client";

import { useCategoriesActive } from "@/queries/useCategory";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const MenuDesktop = () => {
  const { data: categories, isPending } = useCategoriesActive();

  const categoriesFiltered = categories?.filter(
    (category) => ![1, 2, 3].includes(category.ordered)
  );

  return (
    <NavigationMenu viewport={false} className="w-full max-w-[100vw] flex-none">
      <NavigationMenuList className="w-9/12 mt-8 mx-auto font-bold font-helvetica text-md text-center">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href={`/portfolio/${categories?.find((category) => category.ordered === 3)?.id}`}
              className="hover:text-primary transition"
            >
              PORTFOLIO
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-primary transition">
            <p className="font-bold">REPORTAGE</p>
            <NavigationMenuContent className="bg-white z-50">
              <ul className="grid gap-0.5 md:w-[400px] lg:w-[500px]">
                {isPending ? (
                  <div className="flex justify-center items-center h-full w-full min-w-32 min-h-10">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : (
                  (categoriesFiltered || []).map((category) => (
                    <li className="row-span-3" key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/portfolio/${category.id}`}
                          className="hover:bg-primary/20 transition rounded-md px-2 py-1 font-semibold"
                        >
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href={`/portfolio/${categories?.find((category) => category.ordered === 1)?.id}`}
              className="hover:text-primary transition"
            >
              PORTRAITS
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href={`/portfolio/${categories?.find((category) => category.ordered === 2)?.id}`}
              className="hover:text-primary transition"
            >
              PUBLICATIONS
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact" className="hover:text-primary transition">
              CONTACT
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/apropos"
              className="hover:text-primary transition whitespace-nowrap"
            >
              A PROPOS
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuDesktop;
