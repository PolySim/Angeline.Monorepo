"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/queries/useCategory";
import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import DeleteCategory from "./deleteCategory";
import ToggleVisibilities from "./toggleVisibilities";
import { AdminEmpty, AdminError, AdminLoading } from "./adminUi";

export default function Listing() {
  const {
    data: categories = [],
    isPending,
    isError,
    refetch,
  } = useCategories();
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  if (isPending) return <AdminLoading label="Chargement des reportages…" />;
  if (isError) return <AdminError retry={() => void refetch()} />;
  const filtered = [...categories]
    .sort((a, b) => a.ordered - b.ordered)
    .filter(
      (category) =>
        category.name
          .toLocaleLowerCase("fr")
          .includes(search.trim().toLocaleLowerCase("fr")) &&
        (visibility === "all" ||
          (visibility === "hidden" ? category.disabled : !category.disabled)),
    );
  return (
    <section aria-label="Liste des reportages" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="report-search" className="sr-only">
            Rechercher un reportage
          </label>
          <Input
            id="report-search"
            type="search"
            placeholder="Rechercher un reportage…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Visibilité
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="rounded-md border px-3 text-foreground"
          >
            <option value="all">Tous</option>
            <option value="visible">Visibles</option>
            <option value="hidden">Masqués</option>
          </select>
        </label>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {filtered.length} reportage{filtered.length > 1 ? "s" : ""}
        {filtered.length !== categories.length
          ? ` sur ${categories.length}`
          : ""}
      </p>
      {!categories.length ? (
        <AdminEmpty title="Votre premier reportage commence ici">
          Utilisez « Créer un reportage » pour ajouter un titre, un article et
          vos images.
        </AdminEmpty>
      ) : !filtered.length ? (
        <AdminEmpty title="Aucun résultat">
          <p>Essayez un autre nom ou affichez toutes les visibilités.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setVisibility("all");
            }}
          >
            Effacer les filtres
          </Button>
        </AdminEmpty>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-white">
          {filtered.map((category) => (
            <li
              key={category.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="min-w-0 text-base font-semibold break-words">
                    <Link
                      href={`/admin/category/${category.id}`}
                      className="hover:underline"
                    >
                      {category.name}
                    </Link>
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${category.disabled ? "bg-slate-100 text-slate-600" : "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]"}`}
                  >
                    {category.disabled ? "Masqué" : "Visible"}
                  </span>
                </div>
                {category.ordered <= 3 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Rubrique permanente du portfolio
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center justify-end gap-1">
                <Button variant="outline" asChild>
                  <Link
                    href={`/admin/category/${category.id}`}
                    aria-label={`Modifier ${category.name}`}
                  >
                    Modifier
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                {category.ordered > 3 && (
                  <>
                    <ToggleVisibilities
                      categoryId={category.id}
                      disabled={category.disabled}
                      name={category.name}
                    />
                    <DeleteCategory
                      categoryId={category.id}
                      name={category.name}
                    />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
