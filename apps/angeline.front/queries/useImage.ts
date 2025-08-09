import { getImagesByCategoryId } from "@/action/image.action";
import { useAppParams } from "@/hook/useAppParams";
import { useQuery } from "@tanstack/react-query";

export const useImages = () => {
  const { pageId } = useAppParams();

  return useQuery({
    queryKey: ["images", pageId],
    queryFn: () => getImagesByCategoryId(pageId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!pageId,
  });
};
