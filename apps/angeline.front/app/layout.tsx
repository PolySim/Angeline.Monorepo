import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <ReactQueryProvider>
        <body className={`antialiased`}>
          <Header />
          {children}
          <Footer />
          <Toaster richColors closeButton />
        </body>
      </ReactQueryProvider>
    </html>
  );
}
