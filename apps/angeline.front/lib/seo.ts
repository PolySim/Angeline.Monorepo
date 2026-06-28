import { config } from "@/config/config";

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

  const truncated = cleanValue.slice(0, maxLength).trim();
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpaceIndex > 80 ? lastSpaceIndex : maxLength).trim()}...`;
};

export const pageDescription = (
  value?: string,
  fallback = DEFAULT_DESCRIPTION,
) => truncateText(value, 160) || fallback;

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
