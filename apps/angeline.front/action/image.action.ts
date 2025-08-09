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
