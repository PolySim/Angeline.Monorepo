"use server";

import { config } from "@/config/config";
import { auth } from "@clerk/nextjs/server";
import { Image } from "@repo/types/entities";
import { revalidateTag } from "next/cache";

export const getImagesByCategoryId = async (categoryId: string) => {
  try {
    const response = await fetch(
      `${config.API_URL}/image/category/${categoryId}`,
      {
        cache: "force-cache",
        next: {
          tags: [`images-${categoryId}`],
        },
      }
    );
    if (!response.ok) {
      console.error("Error fetching images", response);
      return [];
    }
    const data = await response.json();
    return data as Image[];
  } catch (error) {
    console.error("Error fetching images", error);
    return [];
  }
};

export const updateImageDescription = async (
  imageId: string,
  description: string,
  categoryId: string
) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(`${config.API_URL}/image/${imageId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      console.error("Error updating image description", response);
      return { success: false };
    }

    revalidateTag(`images-${categoryId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating image description", error);
  }
};

export const deleteImage = async (imageId: string, categoryId: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(`${config.API_URL}/image/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error deleting image", response);
      return { success: false };
    }

    revalidateTag(`images-${categoryId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting image", error);
  }
};

export const reorderImages = async (categoryId: string, imageIds: string[]) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(
      `${config.API_URL}/image/reorder/${categoryId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageIds }),
      }
    );

    if (!response.ok) {
      console.error("Error reordering images", response);
      return { success: false };
    }

    revalidateTag(`images-${categoryId}`);

    return { success: true };
  } catch (error) {
    console.error("Error reordering images", error);
  }
};

export const uploadImages = async ({
  formData,
  pageId,
}: {
  formData: FormData;
  pageId: string;
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(`${config.API_URL}/image/${pageId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Error uploading images", response);
      return { success: false };
    }

    revalidateTag(`images-${pageId}`);

    return { success: true };
  } catch (error) {
    console.error("Error uploading images", error);
    return { success: false };
  }
};

export const initiateChunkUpload = async ({
  categoryId,
  fileName,
  fileSize,
  fileHash,
}: {
  categoryId: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("Unauthorized for initiating chunk upload");
      return { success: false };
    }

    const res = await fetch(`${config.API_URL}/image/chunk/initiate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: categoryId,
        fileName,
        fileSize,
        fileHash,
      }),
    });

    if (!res.ok) {
      console.error("Error in initiating chunk upload", res.statusText);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in initiating chunk upload", error);
    return { success: false };
  }
};

export const uploadChunk = async ({
  chunk,
  chunkIndex,
  totalChunks,
  fileHash,
  fileName,
  categoryId,
  fileSize,
}: {
  chunk: Blob;
  chunkIndex: number;
  totalChunks: number;
  fileHash: string;
  fileName: string;
  categoryId: string;
  fileSize: number;
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("Unauthorized for uploading chunk");
      return { success: false };
    }

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("fileHash", fileHash);
    formData.append("fileName", fileName);
    formData.append("category", categoryId);
    formData.append("fileSize", fileSize.toString());

    const res = await fetch(`${config.API_URL}/image/chunk/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.error("Error in uploading chunk", res.statusText);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in uploading chunk", error);
    return { success: false };
  }
};

export const getChunkStatus = async (fileHash: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("Unauthorized for getting chunk status");
      return { success: false };
    }

    const res = await fetch(
      `${config.API_URL}/image/chunk/status/${fileHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error in getting chunk status", res.statusText);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in getting chunk status", error);
    return { success: false };
  }
};

export const completeChunkUpload = async ({
  fileHash,
  categoryId,
}: {
  fileHash: string;
  categoryId: string;
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("Unauthorized for completing chunk upload");
      return { success: false };
    }

    const res = await fetch(`${config.API_URL}/image/chunk/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileHash,
        category: categoryId,
      }),
    });

    if (!res.ok) {
      console.error("Error in completing chunk upload", res.statusText);
      return { success: false };
    }

    const data = (await res.json()) as Image;
    revalidateTag(`images-${categoryId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in completing chunk upload", error);
    return { success: false };
  }
};

export const cancelChunkUpload = async (fileHash: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      console.error("Unauthorized for cancelling chunk upload");
      return { success: false };
    }

    const res = await fetch(
      `${config.API_URL}/image/chunk/cancel/${fileHash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error in cancelling chunk upload", res.statusText);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in cancelling chunk upload", error);
    return { success: false };
  }
};

export const downloadCategoryImages = async (categoryId: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false, error: "Non autorisé" };
    }

    const response = await fetch(
      `${config.API_URL}/image/download/category/${categoryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Error downloading category images", response);
      return { success: false, error: "Erreur lors du téléchargement" };
    }

    // Convertir la réponse en blob
    const blob = await response.blob();

    // Créer un URL pour le blob et déclencher le téléchargement

    return { success: true, blob };
  } catch (error) {
    console.error("Error downloading category images", error);
    return {
      success: false,
      error: "Erreur inattendue lors du téléchargement",
    };
  }
};
