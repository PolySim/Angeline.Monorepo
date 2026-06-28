import Script from "next/script";
import { config } from "@/config/config";

export default function UmamiAnalytics() {
  if (!config.UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      src={config.UMAMI_SCRIPT_URL}
      data-website-id={config.UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
