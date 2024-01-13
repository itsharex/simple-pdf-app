import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PDFSplitter = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [splitPages, setSplitPages] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setSplitPages([]);
      setErrorMessage('');
    }
  };

  const handleSplitPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const page = parseInt(event.target.value);
    if (!isNaN(page) && page > 0) {
      setSplitPages((prevPages) => [...prevPages, page].sort((a, b) => a - b));
      setErrorMessage('');
    }
  };

  const handleSplitButtonClick = async () => {
    if (pdfFile && splitPages.length > 0) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const existingPdfBytes = new Uint8Array(
              e.target?.result as ArrayBuffer
            );
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const splitDocs = await Promise.all(
              splitPages.map(async (pageNumber) => {
                const splitDoc = await PDFDocument.create();
                if (pageNumber <= pdfDoc.getPageCount()) {
                  const [copiedPage] = await splitDoc.copyPages(pdfDoc, [
                    pageNumber - 1,
                  ]);
                  splitDoc.addPage(copiedPage);
                }
                const splitPdfBytes = await splitDoc.save();
                return new Blob([splitPdfBytes], { type: 'application/pdf' });
              })
            );

            // Now handle the blobs, either download them or display them
            splitDocs.forEach((blob, index) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `page-${splitPages[index]}.pdf`; // or any other filename
              document.body.appendChild(a);
              a.click();
              URL.revokeObjectURL(url);
              document.body.removeChild(a);
            });
          } catch (error) {
            setErrorMessage(
              'Failed to split the PDF. Please make sure the page numbers are correct.'
            );
            console.error(error);
          }
        };
        reader.readAsArrayBuffer(pdfFile);
      } catch (error) {
        setErrorMessage('Error reading the PDF file.');
        console.error(error);
      }
    } else {
      setErrorMessage(
        'Please select a PDF file and enter at least one page number to split.'
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <br />
        <input
          type="number"
          placeholder="Enter page number"
          onChange={handleSplitPageChange}
        />
        <button onClick={handleSplitButtonClick}>Split PDF</button>
        <br />
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PDFSplitter;
