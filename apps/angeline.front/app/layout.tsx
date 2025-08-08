import Header from "@/components/header/header";
import { ReactQueryProvider } from "@/lib/react-query";
import "./globals.css";
import Footer from "@/components/footer/footer";

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
        </body>
      </ReactQueryProvider>
    </html>
  );
}
