"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/queries/useCategory";
import { Edit2, Loader2 } from "lucide-react";
import DeleteCategory from "./deleteCategory";
import ToggleVisibilities from "./toggleVisibilities";
import Link from "next/link";

const Listing = () => {
  const { data: categories, isPending } = useCategories();

  return (
    <div className="flex flex-col gap-4 flex-1">
      {isPending ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="p-6">
          {(categories || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Aucune catégorie</div>
              <p className="text-gray-500">
                Commencez par créer votre première catégorie
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-lg p-4 transition-all ${
                    !category.disabled
                      ? "border-gray-200 bg-white"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  <div className="flex max-md:flex-col items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3
                          className={`text-lg font-semibold ${
                            !category.disabled
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {category.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            !category.disabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.disabled ? "Inactive" : "Active"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {category.ordered > 3 && (
                        <ToggleVisibilities
                          categoryId={category.id}
                          disabled={category.disabled}
                        />
                      )}
                      <Button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent shadow-none"
                        title="Modifier"
                        asChild
                      >
                        <Link href={`/admin/category/${category.id}`}>
                          <Edit2 size={18} />
                        </Link>
                      </Button>
                      {category.ordered > 3 && (
                        <DeleteCategory categoryId={category.id} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Listing;
