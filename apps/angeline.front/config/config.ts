export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
  APP_URL: "https://angelinedesdevises.fr",
  UMAMI_SCRIPT_URL:
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
    "https://cloud.umami.is/script.js",
  UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  BREVO_API_KEY: process.env.BREVO_API_KEY as string,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY as string,
  CLERK_PUBLISHABLE_KEY: process.env
    .NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
} as const;
