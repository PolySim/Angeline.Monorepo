import { getCategoriesActive } from "@/action/category.action";
import { useQuery } from "@tanstack/react-query";

export const useCategoriesActive = () => {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: getCategoriesActive,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};
