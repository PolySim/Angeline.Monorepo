import CreateCategory from "./createCategory";
import Listing from "./listing";

export default function Admin() {
  return (
    <div className="w-11/12 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportages</h1>
            <p className="mt-2 text-sm text-gray-600">
              Retrouvez, modifiez et publiez vos séries photographiques.
            </p>
          </div>
          <CreateCategory />
        </div>
      </div>
      <Listing />
    </div>
  );
}
