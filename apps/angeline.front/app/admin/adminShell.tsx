"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Reportages" },
  { href: "/admin/order", label: "Ordre d’affichage" },
  { href: "/admin/homepage", label: "Page d’accueil" },
  { href: "/admin/about", label: "Biographie" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen bg-gray-50 text-gray-950 font-sans">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:block focus:p-4"
      >
        Aller au contenu
      </a>
      <header className="border-b bg-white">
        <div className="w-11/12 max-w-6xl mx-auto py-5 flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold text-lg">
            Angeline Desdevises{" "}
            <span className="block text-sm font-normal text-gray-600">
              Administration
            </span>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" /> Voir le site
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </Button>
            <SignOutButton>
              <Button variant="ghost">
                <LogOut aria-hidden="true" /> Déconnexion
              </Button>
            </SignOutButton>
          </div>
        </div>
        <nav
          aria-label="Administration"
          className="w-11/12 max-w-6xl mx-auto flex flex-wrap gap-1 pb-3"
        >
          {navigation.map(({ href, label }) => {
            const active =
              href === "/admin"
                ? pathname === href || pathname.startsWith("/admin/category/")
                : pathname === href;
            return (
              <Button
                key={href}
                variant={active ? "secondary" : "ghost"}
                asChild
              >
                <Link href={href} aria-current={active ? "page" : undefined}>
                  {label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </header>
      <main id="admin-content" className="py-6 md:py-10" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
