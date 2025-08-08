import { getBiography } from "@/action/information.action";
import { useQuery } from "@tanstack/react-query";

export const useBiography = () => {
  return useQuery({
    queryKey: ["biography"],
    queryFn: getBiography,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};
