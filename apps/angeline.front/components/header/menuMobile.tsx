"use client";

import { useAppParams } from "@/hook/useAppParams";
import { cn } from "@/lib/utils";
import { useCategoriesActive } from "@/queries/useCategory";
import { useMenuStore } from "@/store/menu.store";
import { Camera, FileText, Info, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import BurgerMenuTrigger from "./burgerMenuTrigger";

const MenuMobile = () => {
  const isOpen = useMenuStore((state) => state.isOpen);
  const { data: categories, isPending } = useCategoriesActive();
  const { pageId } = useAppParams();

  return (
    <>
      <BurgerMenuTrigger />
      <div
        className={cn(
          "flex flex-col justify-center items-start gap-4 fixed top-0 left-0 right-0 bottom-0 overflow-x-hidden transition-transform duration-300 bg-white font-bold font-helvetica text-md text-center z-20",
          {
            "-translate-x-full": !isOpen,
          }
        )}
      >
        {isPending ? (
          <div className="flex justify-center items-center h-full p-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-y-scroll p-4 space-y-4">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center w-full">
                <FileText size={20} className="mr-2" />
                Sections principales
              </h3>
              <div>
                <Link
                  href={`/portfolio/${categories?.find((category) => category.ordered === 3)?.id}`}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        pageId ===
                        categories?.find((category) => category.ordered === 3)
                          ?.id,
                    }
                  )}
                  onClick={() => {
                    useMenuStore.getState().toggleOpen();
                  }}
                >
                  <Camera size={18} className="mr-3" />
                  Portfolio
                </Link>
                <Link
                  href={`/portfolio/${categories?.find((category) => category.ordered === 1)?.id}`}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        pageId ===
                        categories?.find((category) => category.ordered === 1)
                          ?.id,
                    }
                  )}
                  onClick={() => {
                    useMenuStore.getState().toggleOpen();
                  }}
                >
                  <Camera size={18} className="mr-3" />
                  Portraits
                </Link>
                <Link
                  href={`/portfolio/${categories?.find((category) => category.ordered === 2)?.id}`}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        pageId ===
                        categories?.find((category) => category.ordered === 2)
                          ?.id,
                    }
                  )}
                  onClick={() => {
                    useMenuStore.getState().toggleOpen();
                  }}
                >
                  <Camera size={18} className="mr-3" />
                  Publications
                </Link>
                <Link
                  href={`/contact`}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary": pageId === "contact",
                    }
                  )}
                  onClick={() => {
                    useMenuStore.getState().toggleOpen();
                  }}
                >
                  <Mail size={18} className="mr-3" />
                  Contact
                </Link>
                <Link
                  href={`/apropos`}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary": pageId === "apropos",
                    }
                  )}
                  onClick={() => {
                    useMenuStore.getState().toggleOpen();
                  }}
                >
                  <Info size={18} className="mr-3" />A propos
                </Link>
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Camera size={18} className="mr-2" />
                Reportages
              </h3>
              <div>
                {(categories || [])
                  .filter((category) => category.ordered > 3)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/portfolio/${category.id}`}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                        {
                          "bg-primary/20 text-primary": pageId === category.id,
                        }
                      )}
                      onClick={() => {
                        useMenuStore.getState().toggleOpen();
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuMobile;
