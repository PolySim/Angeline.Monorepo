import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query";
import "./globals.css";
import WindowSizeInitializer from "@/lib/WindowSizeInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
