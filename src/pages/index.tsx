import { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import styles from '@/styles/Home.module.css';

const PDFHome: React.FC = () => {
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [mergedPdfName, setMergedPdfName] = useState<string>('merged.pdf');
  const draggedItem = useRef<number | null>(null);
  
  const handlePDFInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const newPdfs = Array.from(files);
      setPdfs((prevPdfs) => [...prevPdfs, ...newPdfs]);
    }
  };
  
  const handleMergedPdfNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMergedPdfName(e.target.value);
  };

  const handleRemovePDF = (index: number) => {
    setPdfs((prevPdfs) => prevPdfs.filter((_, i) => i !== index));
    setThumbnails((prevThumbnails) => prevThumbnails.filter((_, i) => i !== index));
  };

  const handleSortPDFs = () => {
    const sortedPdfs = [...pdfs].sort((a, b) => a.name.localeCompare(b.name));
    const sortedThumbnails = sortedPdfs.map((pdf) => {
      const index = pdfs.findIndex((originalPdf) => originalPdf.name === pdf.name);
      return thumbnails[index];
    });
  
    setPdfs(sortedPdfs);
    setThumbnails(sortedThumbnails);
  };

  const handleMergePDFs = async () => {
    const mergedPdfDoc = await PDFDocument.create();
    for (const pdf of pdfs) {
      const pdfBytes = await pdf.arrayBuffer();
      const sourcePdfDoc = await PDFDocument.load(pdfBytes);
      const sourcePageIndices = sourcePdfDoc.getPageIndices();
      const copiedPages = await mergedPdfDoc.copyPages(sourcePdfDoc, sourcePageIndices);
      for (const page of copiedPages) {
        mergedPdfDoc.addPage(page);
      }
    }
  
    const mergedPdfBytes = await mergedPdfDoc.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(mergedPdfBlob);
    downloadLink.download = mergedPdfName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };  
  

  // Other event handlers remain unchanged

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    draggedItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedItem.current !== null && draggedItem.current !== index) {
      setPdfs((prevPdfs) => {
        const newPdfs = [...prevPdfs];
        const dragItem = newPdfs[draggedItem.current!];
        newPdfs.splice(draggedItem.current!, 1);
        newPdfs.splice(index, 0, dragItem);
        return newPdfs;
      });
      setThumbnails((prevThumbnails) => {
        const newThumbnails = [...prevThumbnails];
        const dragItem = newThumbnails[draggedItem.current!];
        newThumbnails.splice(draggedItem.current!, 1);
        newThumbnails.splice(index, 0, dragItem);
        return newThumbnails;
      });
    }
    draggedItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>PDF Merger</h1>
        </div>
        <div className={styles.pdfInput}>
          <input type="file" multiple onChange={handlePDFInputChange} />
        </div>
        <div className={styles.pdfList}>
        {pdfs && pdfs.map((pdf, index) => (
          <div
            key={pdf.name}
            className={styles.pdfItem}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => handleDragOver(e)}
          >
            <div className={styles.pdfName}>{pdf.name}</div>
            <div className={styles.pdfRemove}>
              <button onClick={() => handleRemovePDF(index)}>X</button>
            </div>
          </div>
        ))}
        </div>
        <div className={styles.pdfActions}>
          <button className={styles.pdfButton} onClick={handleSortPDFs}>
            Sort
          </button>
          <input
            type="text"
            value={mergedPdfName}
            onChange={handleMergedPdfNameChange}
            placeholder="Enter merged PDF filename"
            className={styles.pdfFilename}
          />
          <button
            className={`${styles.pdfButton} ${
              pdfs.length === 0 ? styles.pdfButtonDisabled : ''
            }`}
            onClick={handleMergePDFs}
            disabled={pdfs.length === 0}
          >
            Merge
          </button>
        </div>
      </div>
    </>
  );
}
export default PDFHome;