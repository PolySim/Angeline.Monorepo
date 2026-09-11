"use client";

import { Input } from "@/components/ui/input";
import { useCreateImageByChunks } from "@/queries/useImage";
import { useRef, useState } from "react";

const AddImage = () => {
  const input = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    failed: [] as string[],
  });
  const { mutateAsync: uploadImage } = useCreateImageByChunks();

  const onSubmit = async (data: FileList | null) => {
    if (!data?.length || isPending) return;
    const files = Array.from(data);
    setIsPending(true);
    setProgress({ total: files.length, completed: 0, failed: [] });
    try {
      // Limit memory and chunk requests by uploading one file at a time.
      for (const file of files) {
        let success = false;
        try {
          success = (await uploadImage(file)).success;
        } catch {
          /* The mutation reports the error. */
        }
        setProgress((current) => ({
          ...current,
          completed: current.completed + 1,
          failed: success ? current.failed : [...current.failed, file.name],
        }));
      }
    } finally {
      setIsPending(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="w-full rounded-lg border border-dashed bg-white p-5">
      <label htmlFor="report-images" className="block text-sm font-medium mb-2">
        Ajouter des images
      </label>
      <Input
        id="report-images"
        ref={input}
        type="file"
        multiple
        accept="image/*"
        onChange={(event) => void onSubmit(event.target.files)}
        disabled={isPending}
        aria-describedby="upload-progress"
        className="bg-white"
      />
      <p
        id="upload-progress"
        role="status"
        className="text-sm text-gray-600 mt-2"
      >
        {isPending
          ? `Import en cours : ${progress.completed} / ${progress.total}. Gardez cette page ouverte.`
          : progress.total
            ? `${progress.completed - progress.failed.length} / ${progress.total} images ajoutées.${progress.failed.length ? " Réessayez les fichiers en échec." : ""}`
            : "Vous pouvez sélectionner plusieurs photographies."}
      </p>
      {progress.failed.length > 0 && (
        <ul
          aria-label="Fichiers à réessayer"
          className="mt-2 text-sm text-red-700 list-disc pl-5"
        >
          {progress.failed.map((name, index) => (
            <li key={index} className="break-words">
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddImage;
