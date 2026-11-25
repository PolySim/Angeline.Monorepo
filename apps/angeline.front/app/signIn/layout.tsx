import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Connexion à l’administration",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SignInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-ui flex min-h-screen flex-1 flex-col bg-[#f6f8f8]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link href="/" className="min-w-0">
            <span className="block text-base font-semibold">
              Angeline Desdevises
            </span>
            <span className="text-sm text-muted-foreground">
              Administration
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour au site
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid w-full overflow-hidden rounded-xl border bg-white lg:grid-cols-2">
          <div
            className="relative hidden min-h-[36rem] lg:block"
            aria-hidden="true"
          >
            <Image
              src="/fond_ecran.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1152px) 544px, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:p-10 lg:px-12 lg:py-14">
            <div className="mx-auto w-full max-w-sm">
              <ClerkProvider>{children}</ClerkProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
