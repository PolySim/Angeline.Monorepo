"use client";

import { useWindowSizeStore } from "@/store/windowSize.store";
import MenuDesktop from "./menuDesktop";

const MenuContainer = () => {
  const windowWidth = useWindowSizeStore((state) => state.width);

  return <>{windowWidth > 768 ? <MenuDesktop /> : <></>}</>;
};

export default MenuContainer;
