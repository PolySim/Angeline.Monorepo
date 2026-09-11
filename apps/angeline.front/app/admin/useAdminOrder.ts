"use client";

import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef, useState } from "react";

/** Keep drag and button moves on the same serialized persistence path. */
export function useAdminOrder<T extends { id: string }>(
  items: T[],
  save: (items: T[]) => Promise<{ success: boolean } | undefined>,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const busy = useRef(false);
  const submitRef = useRef<(values: T[]) => void>(() => {});
  const [parent, values, setValues, updateConfig] = useDragAndDrop<
    HTMLDivElement,
    T
  >(items, {
    dragHandle: ".drag-handle",
    onDragend: (event) => submitRef.current(event.values as unknown as T[]),
  });
  useEffect(() => {
    if (!busy.current) setValues(items);
  }, [items, pending, setValues]);
  useEffect(() => {
    updateConfig({
      disabled: pending,
      dragHandle: ".drag-handle",
      onDragend: (event) => submitRef.current(event.values as unknown as T[]),
    });
  }, [pending, updateConfig]);
  const submit = async (next: T[]) => {
    if (
      busy.current ||
      next.every((item, index) => item.id === items[index]?.id)
    )
      return;
    busy.current = true;
    setPending(true);
    setError(false);
    setSaved(false);
    setValues(next);
    try {
      const result = await save(next);
      if (!result?.success) throw new Error("Order not saved");
      setSaved(true);
    } catch {
      setValues(items);
      setError(true);
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  useEffect(() => {
    submitRef.current = (next) => {
      void submit(next);
    };
  });
  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= values.length) return;
    const next = [...values];
    [next[index], next[destination]] = [next[destination], next[index]];
    void submit(next);
  };
  return { parent, values, move, pending, error, saved };
}
