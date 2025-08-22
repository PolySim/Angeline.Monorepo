import { getBiography } from "@/action/information.action";
import StructuredData from "@/components/seo/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config/config";
import { ReactQueryProvider } from "@/lib/react-query";
import WindowSizeInitializer from "@/lib/WindowSizeInitializer";
import { ClerkProvider } from "@clerk/nextjs";
import { Lang } from "@repo/types/entities";
import "./globals.css";

export const generateMetadata = async () => {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);

  const description =
    biographyFr?.content && biographyFr.content.length > 160
      ? biographyFr.content.slice(0, 160) + "..."
      : biographyFr?.content ||
        "Photographe documentaire spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban. Photojournalisme et reportages d'actualité.";

  return {
    title: {
      default: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      template: "%s | Angeline Desdevises",
    },
    description,
    keywords: [
      "photographe",
      "photography",
      "documentaire",
      "documentary",
      "photojournalisme",
      "photojournalism",
      "conflit",
      "conflict",
      "guerre",
      "war",
      "Moyen-Orient",
      "Middle East",
      "Syrie",
      "Syria",
      "Liban",
      "Lebanon",
      "actualité",
      "reportage",
      "war photography",
      "conflict photography",
      "Rennes",
      "Bretagne",
      "Angeline Desdevises",
    ],
    authors: [{ name: "Angeline Desdevises" }],
    creator: "Angeline Desdevises",
    publisher: "Angeline Desdevises",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // Open Graph
    openGraph: {
      type: "website",
      locale: "fr_FR",
      alternateLocale: "en_US",
      title: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      siteName: "Angeline Desdevises - War Photography",
      url: config.APP_URL,
      images: [
        {
          url: `${config.APP_URL}/home.jpg`,
          width: 1920,
          height: 1080,
          alt: "Portfolio Angeline Desdevises",
          type: "image/jpeg",
        },
      ],
    },
    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      site: "@angelinedesdevises", // À remplacer par le vrai handle Twitter s'il existe
      creator: "@angelinedesdevises",
      title: "Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      images: [`${config.APP_URL}/home.jpg`],
    },
    // Métadonnées robots
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
    // Icônes et manifeste
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    alternates: {
      canonical: config.APP_URL,
    },
    // Autres métadonnées
    category: "photography",
    classification: "Portfolio Photography",
    referrer: "origin-when-cross-origin",
  };
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    colorScheme: "light",
    themeColor: "#ffffff",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <ReactQueryProvider>
          <body className="antialiased min-h-screen w-screen flex flex-col">
            <StructuredData type="person" />
            <StructuredData type="organization" />
            {children}
            <Toaster richColors closeButton />
            <WindowSizeInitializer />
          </body>
        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  );
}
