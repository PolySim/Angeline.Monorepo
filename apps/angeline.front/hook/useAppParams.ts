import { useParams } from "next/navigation";

type UseAppParams = {
  pageId: string;
};

export const useAppParams = (): UseAppParams => {
  const params = useParams();

  return {
    pageId: (params.pageId ?? "") as string,
  };
};
