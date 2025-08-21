import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Page non trouvée - 404",
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        {/* Code d'erreur stylisé */}
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>

        {/* Message principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été
          déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild variant="default" size="lg" className="min-w-[160px]">
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/portfolio" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Voir le portfolio
            </Link>
          </Button>
        </div>

        {/* Navigation d'aide */}
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-4">Vous cherchez peut-être :</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/apropos" className="hover:text-gray-700 underline">
              À propos
            </Link>
            <Link href="/contact" className="hover:text-gray-700 underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
