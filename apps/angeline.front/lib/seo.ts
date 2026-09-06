import { config } from "@/config/config";
import type { Metadata } from "next";

const DEFAULT_DESCRIPTION =
  "Photographe documentaire spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban. Photojournalisme et reportages d'actualité.";

export const absoluteUrl = (path = "") => {
  if (!path) return config.APP_URL;
  if (path.startsWith("http")) return path;
  return `${config.APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const stripLineBreaks = (value?: string) =>
  value?.replace(/\s+/g, " ").trim() ?? "";

export const truncateText = (value?: string, maxLength = 160) => {
  const cleanValue = stripLineBreaks(value);
  if (!cleanValue) return "";
  if (cleanValue.length <= maxLength) return cleanValue;

  const truncated = cleanValue.slice(0, Math.max(0, maxLength - 1)).trim();
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpaceIndex > 80 ? lastSpaceIndex : maxLength - 1).trim()}…`;
};

export const pageDescription = (
  value?: string,
  fallback = DEFAULT_DESCRIPTION,
) => truncateText(value, 160) || truncateText(fallback, 160);

export const slugify = (value?: string) =>
  stripLineBreaks(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getPortfolioIdFromParam = (value: string) =>
  value.includes("--") ? value.split("--").pop() || value : value;

export const portfolioPath = (category?: { id?: string; name?: string }) => {
  if (!category?.id) return "/portfolio";

  const slug = slugify(category.name);
  return `/portfolio/${slug ? `${slug}--` : ""}${category.id}`;
};

export const createPageMetadata = ({
  title,
  description,
  path,
  images,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  images: { url: string; alt: string }[];
  type?: "website" | "article" | "profile";
}): Metadata => ({
  title,
  description,
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    title,
    description,
    url: absoluteUrl(path),
    siteName: "Angeline Desdevises",
    locale: "fr_FR",
    type,
    images,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images,
  },
});
