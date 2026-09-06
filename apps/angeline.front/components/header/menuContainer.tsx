"use client";

import type { Category } from "@repo/types/entities";
import MenuDesktop from "./menuDesktop";
import MenuMobile from "./menuMobile";

const MenuContainer = ({ categories }: { categories: Category[] }) => {
  return (
    <>
      <div className="hidden md:block">
        <MenuDesktop categories={categories} />
      </div>
      <div className="md:hidden">
        <MenuMobile categories={categories} />
      </div>
    </>
  );
};

export default MenuContainer;
