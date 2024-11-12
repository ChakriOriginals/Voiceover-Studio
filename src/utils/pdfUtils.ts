import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker path correctly using Vite's URL handling
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

export async function extractTextFromPDF(file: File): Promise<string> {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Please provide a valid PDF file');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `Page ${i}\n${pageText}\n\n`;
    }
    
    return fullText.trim();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract text from PDF';
    throw new Error(`PDF processing error: ${errorMessage}`);
  }
}