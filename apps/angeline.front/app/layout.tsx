import { getBiography } from "@/action/information.action";
import StructuredData from "@/components/seo/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query";
import WindowSizeInitializer from "@/lib/WindowSizeInitializer";
import { ClerkProvider } from "@clerk/nextjs";
import { Lang } from "@repo/types/entities";
import { Metadata } from "next";
import "./globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
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
  };
};

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
