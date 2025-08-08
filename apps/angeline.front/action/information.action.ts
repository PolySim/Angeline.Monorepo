"use server";

import { config } from "@/config/config";
import { Information } from "@repo/types/entities";

export const getBiography = async () => {
  try {
    const response = await fetch(`${config.API_URL}/information`);
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
