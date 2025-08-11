import { useParams, usePathname } from "next/navigation";

type UseAppParams = {
  pageId: string;
};

export const useAppParams = (): UseAppParams => {
  const params = useParams();
  const pathname = usePathname();
  const pageId = pathname.split("/").pop();

  return {
    pageId: (params.pageId ?? pageId ?? "") as string,
  };
};
