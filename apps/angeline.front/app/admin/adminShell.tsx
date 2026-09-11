"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ExternalLink,
  Images,
  House,
  LogOut,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Reportages", icon: Images },
  { href: "/admin/order", label: "Ordre d’affichage", icon: ArrowUpDown },
  { href: "/admin/homepage", label: "Page d’accueil", icon: House },
  { href: "/admin/about", label: "Biographie", icon: UserRound },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="admin-ui min-h-screen bg-[#f6f8f8]">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
      >
        Aller au contenu
      </a>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link href="/admin" className="min-w-0">
            <span className="block text-base font-semibold">
              Angeline Desdevises
            </span>
            <span className="text-sm text-muted-foreground">
              Administration
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" asChild>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Voir le site (nouvel onglet)"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Voir le site</span>
              </Link>
            </Button>
            <SignOutButton>
              <Button variant="outline">
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sr-only sm:hidden">Déconnexion</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
        <nav
          aria-label="Administration"
          className="mx-auto flex max-w-6xl flex-wrap gap-1 px-3 sm:px-8"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === href || pathname.startsWith("/admin/category/")
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${active ? "border-[var(--admin-accent)] text-[var(--admin-accent)]" : "border-transparent text-muted-foreground hover:border-slate-300 hover:text-foreground"}`}
              >
                <Icon className="hidden size-4 sm:block" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main
        id="admin-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10"
      >
        {children}
      </main>
    </div>
  );
}
