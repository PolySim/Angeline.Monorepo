"use client";

import { Button } from "@/components/ui/button";
import { useCategories, useUpdateCategoriesOrder } from "@/queries/useCategory";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { Category } from "@repo/types/entities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { useState } from "react";

export default function OrderForm() {
  const { data: categories } = useCategories();
  const categoriesFiltered = (categories || []).filter(
    (category) => category.ordered > 3,
  );
  const [saved, setSaved] = useState(categoriesFiltered);
  const { mutate: updateCategoriesOrder, isPending } =
    useUpdateCategoriesOrder();

  const [parent, tapes, setValue] = useDragAndDrop<HTMLDivElement, Category>(
    categoriesFiltered,
    { dragHandle: ".drag-handle" },
  );

  const move = (index: number, offset: number) => {
    const next = [...tapes];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    setValue(next);
  };
  const dirty = tapes.some((tape, index) => tape.id !== saved[index]?.id);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Glissez les reportages ou utilisez les flèches, puis enregistrez. Les
        rubriques permanentes gardent leur place.
      </p>
      {tapes.length === 0 && <p>Aucun reportage à réordonner.</p>}
      <div
        ref={parent}
        inert={isPending}
        className="flex flex-col divide-y border rounded-lg"
      >
        {tapes.map((tape, index) => (
          <div
            key={tape.id}
            className="p-4 bg-white cursor-grab flex items-center gap-3"
          >
            <GripVertical
              aria-hidden="true"
              className="drag-handle shrink-0 text-gray-400"
            />
            <h2 className="flex-1 min-w-0 break-words font-medium">
              {tape.name}
            </h2>
            <Button
              size="icon"
              variant="outline"
              disabled={index === 0}
              onClick={() => move(index, -1)}
              aria-label={`Monter ${tape.name}`}
            >
              <ArrowUp />
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={index === tapes.length - 1}
              onClick={() => move(index, 1)}
              aria-label={`Descendre ${tape.name}`}
            >
              <ArrowDown />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-end items-center gap-3">
        <span role="status" className="text-sm text-gray-600">
          {dirty ? "Ordre non enregistré" : "Ordre enregistré"}
        </span>
        <Button
          variant="outline"
          disabled={!dirty || isPending}
          onClick={() => setValue(saved)}
        >
          Annuler
        </Button>
        <Button
          disabled={!dirty || isPending}
          onClick={() =>
            updateCategoriesOrder(
              { orderedIds: tapes.map((tape) => tape.id) },
              {
                onSuccess: (response) => {
                  if (response.success) setSaved([...tapes]);
                },
              },
            )
          }
        >
          {isPending ? "Enregistrement…" : "Enregistrer l’ordre"}
        </Button>
      </div>
    </div>
  );
}
