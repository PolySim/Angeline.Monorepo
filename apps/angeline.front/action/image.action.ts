"use server";

import { config } from "@/config/config";
import { Image } from "@repo/types/entities";

export const getImagesByCategoryId = async (categoryId: string) => {
  try {
    const response = await fetch(
      `${config.API_URL}/image/category/${categoryId}`,
      {
        cache: "force-cache",
        next: {
          tags: ["images", categoryId],
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
