import { getBiography } from "@/action/information.action";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query";
import WindowSizeInitializer from "@/lib/WindowSizeInitializer";
import { ClerkProvider } from "@clerk/nextjs";
import { Lang } from "@repo/types/entities";
import "./globals.css";

export const generateMetadata = async () => {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);

  return {
    title: {
      default: "Angeline Desdevises",
      template: "%s | Angeline Desdevises",
    },
    description:
      biographyFr?.content && biographyFr.content.length > 300
        ? biographyFr.content.slice(0, 300)
        : biographyFr?.content || "",
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
          <body className="antialiased min-h-screen flex flex-col">
            <Header />
            {children}
            <Footer />
            <Toaster richColors closeButton />
            <WindowSizeInitializer />
          </body>
        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  );
}
