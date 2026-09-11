"use client";

import { downloadCategoryImages } from "@/action/image.action";
import { Button } from "@/components/ui/button";
import { useAppParams } from "@/hook/useAppParams";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DownloadCategoryButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { pageId } = useAppParams();

  const handleDownload = async () => {
    if (!pageId || isDownloading) return;

    setIsDownloading(true);
    try {
      const result = await downloadCategoryImages(pageId);

      if (!result.success || !result.blob) {
        toast.error(result.error || "Erreur lors du téléchargement");
        return;
      }

      const url = window.URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `category_${pageId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL du blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur inattendue lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || !pageId}
      variant="outline"
      className="w-fit shrink-0"
    >
      {isDownloading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {isDownloading ? "Téléchargement..." : "Télécharger les images"}
    </Button>
  );
}
