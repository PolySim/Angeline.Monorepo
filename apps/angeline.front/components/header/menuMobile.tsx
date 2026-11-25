"use client";

import { Camera, FileText, Info, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAppParams } from "@/hook/useAppParams";
import { getPortfolioIdFromParam, portfolioPath } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useCategoriesActive } from "@/queries/useCategory";
import { useMenuStore } from "@/store/menu.store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import BurgerMenuTrigger from "./burgerMenuTrigger";
import type { Category } from "@repo/types/entities";

const MenuMobile = ({
  categories: initialCategories,
}: {
  categories: Category[];
}) => {
  const [isReportagesOpen, setIsReportagesOpen] = useState(false);
  const isOpen = useMenuStore((state) => state.isOpen);
  const { data: categories, isPending } =
    useCategoriesActive(initialCategories);
  const { pageId } = useAppParams();
  const activePortfolioId = getPortfolioIdFromParam(pageId);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    const { isOpen, toggleOpen } = useMenuStore.getState();
    if (!isOpen) return;
    buttonRef.current?.focus({ preventScroll: true });
    toggleOpen();
    setIsReportagesOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // The force-mounted desktop navigation can consume Escape even on mobile.
      const inMenu =
        event.target instanceof Node &&
        (buttonRef.current === event.target || menuRef.current?.contains(event.target));
      if (event.defaultPrevented && !inMenu) return;
      event.preventDefault();
      closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <>
      <BurgerMenuTrigger controls={menuId} buttonRef={buttonRef} />
      <nav
        ref={menuRef}
        id={menuId}
        aria-label="Navigation principale"
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={cn(
          "flex flex-col justify-center items-start gap-4 fixed top-0 left-0 right-0 bottom-0 overflow-x-hidden transition-transform duration-300 bg-white font-bold font-helvetica text-md text-center z-20",
          {
            "-translate-x-full": !isOpen,
          },
        )}
      >
        {isPending ? (
          <div role="status" className="flex justify-center items-center h-full p-4">
            <span className="sr-only">Chargement de la navigation</span>
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-y-scroll p-4 space-y-4 w-full">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center w-full">
                <FileText size={20} className="mr-2" />
                Sections principales
              </h3>
              <div>
                <Link
                  href={portfolioPath(
                    categories?.find((category) => category.ordered === 3),
                  )}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        activePortfolioId ===
                        categories?.find((category) => category.ordered === 3)
                          ?.id,
                    },
                  )}
                  onClick={closeMenu}
                >
                  <Camera size={18} className="mr-3" />
                  Portfolio
                </Link>
                <Link
                  href={portfolioPath(
                    categories?.find((category) => category.ordered === 1),
                  )}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        activePortfolioId ===
                        categories?.find((category) => category.ordered === 1)
                          ?.id,
                    },
                  )}
                  onClick={closeMenu}
                >
                  <Camera size={18} className="mr-3" />
                  Portraits
                </Link>
                <Link
                  href={portfolioPath(
                    categories?.find((category) => category.ordered === 2),
                  )}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                    {
                      "bg-primary/20 text-primary":
                        activePortfolioId ===
                        categories?.find((category) => category.ordered === 2)
                          ?.id,
                    },
                  )}
                  onClick={closeMenu}
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
                    },
                  )}
                  onClick={closeMenu}
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
                    },
                  )}
                  onClick={closeMenu}
                >
                  <Info size={18} className="mr-3" />A propos
                </Link>
              </div>
            </div>
            <Accordion
              value={isReportagesOpen ? "item-1" : ""}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value="item-1" className="w-full">
                <AccordionTrigger
                  className="w-full flex items-center justify-between"
                  onClick={() => setIsReportagesOpen((curr) => !curr)}
                >
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Camera size={18} className="mr-2" />
                    Reportages
                  </h3>
                </AccordionTrigger>
                <AccordionContent forceMount inert={!isReportagesOpen}>
                  <div>
                    {(categories || [])
                      .filter((category) => category.ordered > 3)
                      .map((category) => (
                        <Link
                          key={category.id}
                          href={portfolioPath(category)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center hover:bg-gray-100",
                            {
                              "bg-primary/20 text-primary":
                                activePortfolioId === category.id,
                            },
                          )}
                          onClick={closeMenu}
                        >
                          {category.name}
                        </Link>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </nav>
    </>
  );
};

export default MenuMobile;
