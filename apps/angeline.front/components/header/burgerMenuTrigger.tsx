"use client";

import type { Ref } from "react";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/menu.store";

const BurgerMenuTrigger = ({
  controls,
  buttonRef,
}: {
  controls: string;
  buttonRef: Ref<HTMLButtonElement>;
}) => {
  const isOpen = useMenuStore((state) => state.isOpen);

  return (
    <div className="fixed top-0 right-0 w-fit p-5 z-[100000000] pointer-events-auto">
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls={controls}
        className="flex flex-col justify-start ml-auto w-10 h-10 cursor-pointer bg-black/10 backdrop-blur-[10px] rounded-xl p-2 transition-all duration-300 ease-in-out border border-white/20 hover:bg-black/20 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={useMenuStore.getState().toggleOpen}
      >
        <span aria-hidden="true" className="block w-full">
          <span
            className={cn(
              "block w-full h-[3px] bg-white my-1 transition-all duration-300 ease-in-out rounded-sm",
              isOpen && "transform rotate-[135deg] translate-y-[7px]",
            )}
          />
          <span
            className={cn(
              "block w-full h-[3px] bg-white my-1 transition-all duration-300 ease-in-out rounded-sm",
              isOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block w-full h-[3px] bg-white my-1 transition-all duration-300 ease-in-out rounded-sm",
              isOpen && "transform -rotate-[135deg] -translate-y-[7px]",
            )}
          />
        </span>
      </button>
    </div>
  );
};

export default BurgerMenuTrigger;
