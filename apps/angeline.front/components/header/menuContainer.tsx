"use client";

import { useWindowSizeStore } from "@/store/windowSize.store";
import MenuDesktop from "./menuDesktop";
import MenuMobile from "./menuMobile";

const MenuContainer = () => {
  const windowWidth = useWindowSizeStore((state) => state.width);

  return <>{windowWidth > 768 ? <MenuDesktop /> : <MenuMobile />}</>;
};

export default MenuContainer;
