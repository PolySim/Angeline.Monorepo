import {
  cancelChunkUpload,
  completeChunkUpload,
  deleteImage,
  getImagesByCategoryId,
  initiateChunkUpload,
  reorderImages,
  updateImageDescription,
  uploadChunk,
  uploadImages,
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

export const useUploadImages = () => {
  const queryClient = useQueryClient();
  const { pageId } = useAppParams();
  return useMutation({
    mutationFn: (formData: FormData) => uploadImages({ formData, pageId }),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["images", pageId] });
    },
    onSuccess: (result) => {
      if (!result?.success) {
        toast.error("Une erreur est survenue lors de l'upload des images");
      }
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'upload des images");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["images", pageId] });
    },
  });
};

// Fonction utilitaire pour calculer le hash d'un fichier côté client
const calculateFileHash = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  let hash = 0;
  const sampleSize = Math.min(1024, uint8Array.length);

  for (let i = 0; i < sampleSize; i++) {
    hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
  }

  const fileInfo = `${file.name}_${file.size}_${file.lastModified}`;
  for (let i = 0; i < fileInfo.length; i++) {
    hash = ((hash << 5) - hash + fileInfo.charCodeAt(i)) & 0xffffffff;
  }

  return Math.abs(hash).toString(16);
};

export const useCreateImageByChunks = () => {
  const queryClient = useQueryClient();
  const { pageId } = useAppParams();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const CHUNK_SIZE = 512 * 1024; // 512KB
        const fileHash = await calculateFileHash(file);
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        // Étape 1: Initier l'upload
        const initiateResult = await initiateChunkUpload({
          categoryId: pageId,
          fileName: file.name,
          fileSize: file.size,
          fileHash,
        });

        if (!initiateResult.success) {
          console.error("Échec initiation:", initiateResult);
          return { success: false, error: "Échec de l'initiation de l'upload" };
        }

        // Étape 2: Uploader chaque chunk
        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          const uploadResult = await uploadChunk({
            chunk,
            chunkIndex: i,
            totalChunks,
            fileHash,
            fileName: file.name,
            categoryId: pageId,
            fileSize: file.size,
          });

          if (!uploadResult.success) {
            console.error(`Échec upload chunk ${i}:`, uploadResult);
            await cancelChunkUpload(fileHash);
            return { success: false, error: `Échec de l'upload du chunk ${i}` };
          }
        }

        // Étape 3: Finaliser l'upload
        const completeResult = await completeChunkUpload({
          fileHash,
          categoryId: pageId,
        });

        if (!completeResult.success) {
          console.error("Échec finalisation");
          return {
            success: false,
            error: "Échec de la finalisation de l'upload",
          };
        }

        return { success: true, data: completeResult.data };
      } catch (error) {
        console.error(
          "Error in useCreateImageByChunks - Exception non gérée:",
          error
        );
        console.error(
          "Stack trace:",
          error instanceof Error ? error.stack : "N/A"
        );

        // Essayer d'annuler si on a le fileHash
        try {
          const fileHash = await calculateFileHash(file);
          await cancelChunkUpload(fileHash);
        } catch (cancelError) {
          console.error("Erreur lors de l'annulation:", cancelError);
        }

        return { success: false, error: "Erreur inattendue lors de l'upload" };
      }
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["images", pageId] });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Image uploadée avec succès");
        if (data.data) {
          queryClient.setQueryData(["images", pageId], (old: Image[]) => [
            ...old,
            data.data,
          ]);
        }
      } else {
        toast.error(data.error || "Erreur lors de l'upload de l'image");
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'upload de l'image");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["images", pageId] });
    },
  });
};
