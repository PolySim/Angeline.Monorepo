"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/queries/useCategory";
import { useState } from "react";
import Link from "next/link";
import DeleteCategory from "./deleteCategory";
import ToggleVisibilities from "./toggleVisibilities";

export default function Listing() {
  const {
    data: categories = [],
    isPending,
    isError,
    refetch,
  } = useCategories();
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const filtered = categories.filter(
    (category) =>
      category.name
        .toLocaleLowerCase("fr")
        .includes(search.trim().toLocaleLowerCase("fr")) &&
      (visibility === "all" || category.disabled === (visibility === "hidden")),
  );

  if (isPending)
    return (
      <div role="status" className="space-y-3">
        <span className="sr-only">Chargement des reportages</span>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-20 w-full" />
        ))}
      </div>
    );
  if (isError)
    return (
      <div role="alert" className="space-y-3">
        <p>Impossible de charger les reportages.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="report-search"
            className="block text-sm font-medium mb-2"
          >
            Rechercher un reportage
          </label>
          <Input
            id="report-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom du reportage…"
            className="bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="report-visibility"
            className="block text-sm font-medium mb-2"
          >
            Visibilité
          </label>
          <select
            id="report-visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="h-9 w-full rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Tous les reportages</option>
            <option value="visible">Visibles sur le site</option>
            <option value="hidden">Masqués</option>
          </select>
        </div>
      </div>
      <p role="status" className="text-sm text-gray-600 mb-3">
        {filtered.length} reportage{filtered.length > 1 ? "s" : ""} sur{" "}
        {categories.length}
      </p>
      {filtered.length === 0 ? (
        <div className="py-12 text-center border rounded-lg bg-white">
          <h2 className="font-semibold">
            {categories.length ? "Aucun résultat" : "Votre premier reportage"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {categories.length
              ? "Essayez un autre nom ou retirez le filtre."
              : "Utilisez « Créer un reportage » pour ajouter une série."}
          </p>
          {categories.length > 0 && (
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
          )}
        </div>
      ) : (
        <ul className="divide-y rounded-lg border bg-white">
          {filtered.map((category) => (
            <li
              key={category.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/category/${category.id}`}
                  className="font-semibold break-words hover:underline underline-offset-4"
                >
                  {category.name}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  {category.disabled
                    ? "Masqué sur le site"
                    : "Visible sur le site"}
                  {category.ordered <= 3 && " · Rubrique permanente"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button variant="outline" asChild>
                  <Link href={`/admin/category/${category.id}`}>
                    Modifier<span className="sr-only"> {category.name}</span>
                  </Link>
                </Button>
                {category.ordered > 3 && (
                  <>
                    <ToggleVisibilities
                      categoryId={category.id}
                      disabled={category.disabled}
                    />
                    <DeleteCategory
                      categoryId={category.id}
                      categoryName={category.name}
                    />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
