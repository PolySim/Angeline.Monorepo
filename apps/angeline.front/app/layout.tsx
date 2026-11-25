import { Lang } from "@repo/types/entities";
import type { Metadata } from "next";
import { getBiography } from "@/action/information.action";
import UmamiAnalytics from "@/components/seo/UmamiAnalytics";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config/config";
import { ReactQueryProvider } from "@/lib/react-query";
import { absoluteUrl, pageDescription } from "@/lib/seo";
import WindowSizeInitializer from "@/lib/WindowSizeInitializer";
import "./globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);
  const description = pageDescription(biographyFr?.content);

  return {
    metadataBase: new URL(config.APP_URL),
    title: {
      default: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      template: "%s | Angeline Desdevises",
    },
    description,
    authors: [{ name: "Angeline Desdevises" }],
    creator: "Angeline Desdevises",
    publisher: "Angeline Desdevises",
    openGraph: {
      title: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      url: config.APP_URL,
      siteName: "Angeline Desdevises",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: absoluteUrl("/home.jpg"),
          alt: "Angeline Desdevises Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      images: [absoluteUrl("/home.jpg")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: config.APP_URL,
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen w-screen flex flex-col">
        <ReactQueryProvider>
          {children}
          <Toaster richColors closeButton />
          <WindowSizeInitializer />
          <UmamiAnalytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
