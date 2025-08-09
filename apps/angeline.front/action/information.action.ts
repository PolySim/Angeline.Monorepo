"use server";

import { config } from "@/config/config";
import { auth } from "@clerk/nextjs/server";
import { Information, Lang } from "@repo/types/entities";
import { revalidateTag } from "next/cache";

export const getBiography = async () => {
  try {
    const response = await fetch(`${config.API_URL}/information`, {
      cache: "force-cache",
      next: {
        tags: ["information-biography"],
      },
    });
    if (!response.ok) {
      console.error("Error fetching biography", response);
      return null;
    }
    const data = (await response.json()) as Information[];
    return data;
  } catch (error) {
    console.error("Error fetching biography", error);
    return null;
  }
};

export const updateBiography = async (
  biography: Partial<Information> & { lang: Lang }
) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) {
      console.error("Unauthorized");
      return { success: false };
    }

    const response = await fetch(`${config.API_URL}/information`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(biography),
    });
    if (!response.ok) {
      console.error("Error updating biography", response);
      return { success: false };
    }

    revalidateTag("information-biography");

    return { success: true };
  } catch (error) {
    console.error("Error updating biography", error);
    return null;
  }
};
