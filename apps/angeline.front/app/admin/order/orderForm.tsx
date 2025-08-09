"use client";

import useDebounce from "@/hook/useDebonce";
import { useCategories, useUpdateCategoriesOrder } from "@/queries/useCategory";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { Category } from "@repo/types/entities";

export default function OrderForm() {
  const { data: categories } = useCategories();
  const categoriesFiltered = (categories || []).filter(
    (category) => category.ordered > 3
  );
  const { mutate: updateCategoriesOrder } = useUpdateCategoriesOrder({
    onErrorCallback: () => {
      setValue(categoriesFiltered);
    },
  });

  const [parent, tapes, setValue] = useDragAndDrop<HTMLDivElement, Category>(
    categoriesFiltered,
    {
      handleEnd: () => {
        void onSubmit(tapes);
      },
    }
  );

  const onSorted = (lastTapes: Category[]) => {
    if (lastTapes !== tapes) return;
    updateCategoriesOrder({ orderedIds: lastTapes.map((tape) => tape.id) });
  };

  const onSubmit = useDebounce(onSorted, 500);

  return (
    <div ref={parent} className="flex flex-col gap-6 mx-auto mt-12">
      {tapes.map((tape) => (
        <div
          key={tape.id}
          className="rounded-lg shadow-sm p-6 bg-white cursor-grab"
        >
          <h2 className="text-2xl font-helvetica">{tape.name}</h2>
        </div>
      ))}
    </div>
  );
}
