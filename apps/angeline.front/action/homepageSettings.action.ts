"use server";

import { config } from "@/config/config";
import {
  HomepageSettings,
  UpdateHomepageSettingsDto,
} from "@repo/types/entities";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  id: "homepage",
  visible: false,
  title: "Angeline Desdevises, photographe documentaire et photojournaliste",
  content:
    "Travail documentaire autour des conflits, des territoires et des récits humains, avec une attention particulière portée au Moyen-Orient, à la Syrie, au Liban, aux portraits et aux publications de presse.",
};

export const getHomepageSettings = async (): Promise<HomepageSettings> => {
  try {
    const response = await fetch(`${config.API_URL}/homepage-settings`, {
      cache: "force-cache",
      next: {
        tags: ["homepage-settings"],
      },
    });

    if (!response.ok) {
      console.error("Error fetching homepage settings", response);
      return DEFAULT_HOMEPAGE_SETTINGS;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching homepage settings", error);
    return DEFAULT_HOMEPAGE_SETTINGS;
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
