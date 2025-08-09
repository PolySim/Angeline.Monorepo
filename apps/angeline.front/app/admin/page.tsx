import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateCategory from "./createCategory";
import Listing from "./listing";

export default function Admin() {
  return (
    <div className="flex flex-col flex-1 w-11/12 max-w-6xl mx-auto p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des reportages
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/about">A propos</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/order">Ordre des reportages</Link>
            </Button>
            <CreateCategory />
          </div>
        </div>
      </div>
      <Listing />
    </div>
  );
}
