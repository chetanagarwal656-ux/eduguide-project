import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfConversionResult {
  images: string[];
  totalPages: number;
}

export const usePdfToImages = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const convertPdfToImages = useCallback(async (file: File, maxPages: number = 3): Promise<PdfConversionResult> => {
    setIsConverting(true);
    setError(null);
    setCurrentPage(0);
    setTotalPages(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const numPages = Math.min(pdf.numPages, maxPages);
      setTotalPages(numPages);
      
      const images: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        
        const page = await pdf.getPage(i);
        const scale = 2; // Higher scale for better quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
          throw new Error("Could not get canvas context");
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imageData = canvas.toDataURL("image/jpeg", 0.85);
        images.push(imageData);
      }

      setIsConverting(false);
      return { images, totalPages: numPages };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to convert PDF";
      setError(errorMessage);
      setIsConverting(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    convertPdfToImages,
    isConverting,
    currentPage,
    totalPages,
    error,
  };
};
