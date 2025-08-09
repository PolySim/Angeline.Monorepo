export const config = {
  API_URL: process.env.API_URL,
  IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
  BREVO_API_KEY: process.env.BREVO_API_KEY as string,
} as const;
