"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateImageByChunks } from "@/queries/useImage";
import { useRef, useState } from "react";

const fileKey = (file: File) =>
  JSON.stringify([file.name, file.size, file.type, file.lastModified]);

const AddImage = () => {
  const busy = useRef(false);
  const selected = useRef(new Set<string>());
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    added: 0,
    failed: [] as File[],
    uncertain: [] as File[],
  });
  const { mutateAsync: uploadImage } = useCreateImageByChunks();

  const runBatch = async (selection: File[], retry = false) => {
    if (busy.current) return;
    const files = retry ? selection : selection.filter((file) => {
      const key = fileKey(file);
      if (selected.current.has(key)) return false;
      selected.current.add(key);
      return true;
    });
    if (!files.length) return;

    busy.current = true;
    setIsPending(true);
    setProgress((current) => retry
      ? { ...current, failed: [] }
      : { ...current, total: current.total + files.length });
    try {
      // Upload one file at a time, keeping only the files that need attention.
      for (const file of files) {
        const result = await uploadImage(file).catch(() => ({
          success: false as const,
          uncertain: true,
        }));
        setProgress((current) => result.success
          ? { ...current, added: current.added + 1 }
          : result.uncertain
            ? { ...current, uncertain: [...current.uncertain, file] }
            : { ...current, failed: [...current.failed, file] });
      }
    } finally {
      busy.current = false;
      setIsPending(false);
    }
  };

  return (
    <div className="w-full rounded-lg border border-dashed bg-white p-5">
      <label htmlFor="report-images" className="block text-sm font-medium mb-2">
        Ajouter des images
      </label>
      <Input
        id="report-images"
        type="file"
        multiple
        accept="image/*"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          void runBatch(files);
        }}
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
          ? `Import en cours : ${progress.added + progress.failed.length + progress.uncertain.length} / ${progress.total}. Gardez cette page ouverte.`
          : progress.total
            ? `${progress.added} / ${progress.total} images ajoutées.${progress.failed.length ? " Réessayez les fichiers en échec." : ""}`
            : "Vous pouvez sélectionner plusieurs photographies."}
      </p>
      {progress.failed.length > 0 && (
        <ul
          aria-label="Fichiers à réessayer"
          className="mt-2 text-sm text-red-700 list-disc pl-5"
        >
          {progress.failed.map((file) => (
            <li key={fileKey(file)} className="break-words">{file.name}</li>
          ))}
        </ul>
      )}
      {progress.failed.length > 0 && !isPending && (
        <Button className="mt-3" variant="outline" type="button" onClick={() => void runBatch(progress.failed, true)}>
          Réessayer les fichiers en échec
        </Button>
      )}
      {progress.uncertain.length > 0 && (
        <div className="mt-3 text-sm text-red-700" role="status">
          <p>Import non confirmé. Vérifiez la liste des images avant de les sélectionner à nouveau pour éviter les doublons.</p>
          <ul aria-label="Fichiers à vérifier" className="list-disc pl-5">
            {progress.uncertain.map((file) => (
              <li key={fileKey(file)} className="break-words">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddImage;
