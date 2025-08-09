import { getCategoriesActive, getCategoryById } from "@/action/category.action";
import { useAppParams } from "@/hook/useAppParams";
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

export const useCategoryById = () => {
  const { pageId } = useAppParams();

  return useQuery({
    queryKey: ["category", pageId],
    queryFn: () => getCategoryById(pageId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!pageId,
  });
};
