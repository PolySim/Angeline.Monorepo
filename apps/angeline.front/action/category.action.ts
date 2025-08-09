"use server";

import { config } from "@/config/config";
import { auth } from "@clerk/nextjs/server";
import { Category } from "@repo/types/entities";
import { revalidateTag } from "next/cache";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${config.API_URL}/category`, {
      cache: "force-cache",
      next: {
        tags: ["categories-all"],
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

export const getCategoriesActive = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${config.API_URL}/category/active`, {
      cache: "force-cache",
      next: {
        tags: ["categories-active"],
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
        tags: [`categories-${categoryId}`],
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

export const toggleCategoryVisibility = async (categoryId: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(
      `${config.API_URL}/category/${categoryId}/toggle-disabled`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.error("Failed to toggle category visibility", response);
      return { success: false };
    }

    revalidateTag("categories-all");
    revalidateTag(`categories-${categoryId}`);
    revalidateTag("categories-active");

    return response.json();
  } catch (error) {
    console.error("Error toggling category visibility", error);
  }
};

export const createCategory = async ({
  name,
  article,
}: {
  name: string;
  article: string;
}) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${config.API_URL}/category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, article }),
    });
    if (!response.ok) {
      console.error("Failed to create category", response);
      return { success: false };
    }

    revalidateTag("categories-all");
    revalidateTag("categories-active");

    const data = (await response.json()) as Category;

    return { success: true, data };
  } catch (error) {
    console.error("Error creating category", error);
    return { success: false };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${config.API_URL}/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to delete category", response);
      return { success: false };
    }

    revalidateTag("categories-all");
    revalidateTag("categories-active");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category", error);
    return { success: false };
  }
};
