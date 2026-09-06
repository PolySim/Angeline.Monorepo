"use server";

import { config } from "@/config/config";
import {
  HomepageSettings,
  UpdateHomepageSettingsDto,
} from "@repo/types/entities";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export const getHomepageSettings =
  async (): Promise<HomepageSettings | null> => {
    try {
      const response = await fetch(`${config.API_URL}/homepage-settings`, {
        cache: "force-cache",
        next: {
          tags: ["homepage-settings"],
        },
      });

      if (!response.ok) {
        console.error("Error fetching homepage settings", response);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching homepage settings", error);
      return null;
    }
  };

export const updateHomepageSettings = async (
  settings: UpdateHomepageSettingsDto,
) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      return { success: false };
    }

    const response = await fetch(`${config.API_URL}/homepage-settings`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      console.error("Error updating homepage settings", response);
      return { success: false };
    }

    revalidateTag("homepage-settings");

    return {
      success: true,
      data: (await response.json()) as HomepageSettings,
    };
  } catch (error) {
    console.error("Error updating homepage settings", error);
    return { success: false };
  }
};
