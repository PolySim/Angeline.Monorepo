import {
  deleteImage,
  getImagesByCategoryId,
  reorderImages,
  updateImageDescription,
} from "@/action/image.action";
import { useAppParams } from "@/hook/useAppParams";
import { Image } from "@repo/types/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export const useUpdateImageDescription = () => {
  const queryClient = useQueryClient();
  const { pageId } = useAppParams();
  return useMutation({
    mutationFn: ({
      imageId,
      description,
    }: {
      imageId: string;
      description: string;
    }) => updateImageDescription(imageId, description, pageId),
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["images", pageId] });
      const previousImages = queryClient.getQueryData(["images", pageId]);
      queryClient.setQueryData(["images", pageId], (old: Image[]) =>
        old.map((image) =>
          image.id === variables.imageId
            ? { ...image, description: variables.description }
            : image
        )
      );
      return { previousImages };
    },
    onSuccess: (result, variables, context) => {
      if (!result?.success) {
        toast.error(
          "Une erreur est survenue lors de la modification de la description de l'image"
        );
        queryClient.setQueryData(["images", pageId], context?.previousImages);
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["images", pageId], context?.previousImages);
      toast.error(
        "Une erreur est survenue lors de la modification de la description de l'image"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["images", pageId] });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  const { pageId } = useAppParams();
  return useMutation({
    mutationFn: (imageId: string) => deleteImage(imageId, pageId),
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["images", pageId] });
      const previousImages = queryClient.getQueryData(["images", pageId]);
      queryClient.setQueryData(["images", pageId], (old: Image[]) =>
        old.filter((image) => image.id !== variables)
      );
      return { previousImages };
    },
    onSuccess: (result, variables, context) => {
      if (!result?.success) {
        toast.error(
          "Une erreur est survenue lors de la suppression de l'image"
        );
        queryClient.setQueryData(["images", pageId], context?.previousImages);
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["images", pageId], context?.previousImages);
      toast.error("Une erreur est survenue lors de la suppression de l'image");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["images", pageId] });
    },
  });
};

export const useReorderImages = (props?: { onErrorCallback?: () => void }) => {
  const queryClient = useQueryClient();
  const { pageId } = useAppParams();
  return useMutation({
    mutationFn: (imageIds: string[]) => reorderImages(pageId, imageIds),
    onMutate: (imageIds) => {
      queryClient.cancelQueries({ queryKey: ["images", pageId] });
      const previousImages = queryClient.getQueryData(["images", pageId]);
      queryClient.setQueryData(["images", pageId], (old: Image[]) =>
        old.map((image) =>
          imageIds.includes(image.id)
            ? { ...image, ordered: imageIds.indexOf(image.id) }
            : image
        )
      );
      return { previousImages };
    },
    onSuccess: (result, variables, context) => {
      if (!result?.success) {
        toast.error(
          "Une erreur est survenue lors de la réorganisation des images"
        );
        queryClient.setQueryData(["images", pageId], context?.previousImages);
        props?.onErrorCallback?.();
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["images", pageId], context?.previousImages);
      toast.error(
        "Une erreur est survenue lors de la réorganisation des images"
      );
      props?.onErrorCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["images", pageId] });
    },
  });
};
