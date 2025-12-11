import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page non trouvée - 404 | Angeline Desdevises",
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
  robots: {
    index: true, // Autorise l'indexation
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été
          déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 has-[>svg]:px-4 min-w-[160px] flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house size-4"
              aria-hidden="true"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          <p className="mb-4">Vous cherchez peut-être :</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="hover:text-gray-700 underline" href="/apropos">
              À propos
            </Link>
            <Link className="hover:text-gray-700 underline" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
