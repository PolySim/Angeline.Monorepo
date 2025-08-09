"use server";

import { config } from "@/config/config";
import { Category } from "@repo/types/entities";

export const getCategoriesActive = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${config.API_URL}/category/active`, {
      cache: "force-cache",
      next: {
        tags: ["categories", "active"],
      },
    });
    if (!response.ok) {
      console.error("Error fetching categories", response);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const getCategoryById = async (
  categoryId: string
): Promise<Category> => {
  try {
    const response = await fetch(`${config.API_URL}/category/${categoryId}`, {
      cache: "force-cache",
      next: {
        tags: ["categories", categoryId],
      },
    });
    if (!response.ok) {
      console.error("Error fetching category", response);
      return {} as Category;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching category", error);
    return {} as Category;
  }
};
