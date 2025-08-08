"use server";

import { config } from "@/config/config";
import { Category } from "@repo/types/entities";

export const getCategoriesActive = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${config.API_URL}/category/active`);
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
