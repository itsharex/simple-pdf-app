import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import styles from '@/styles/Home.module.css';

const PDFHome: React.FC = () => {
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [mergedPdfName, setMergedPdfName] = useState<string>('merged.pdf');

  const handlePDFInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setPdfs((prevPdfs) => [...prevPdfs, ...files]);
    }
  };

  const handleSortPDFs = () => {
    setPdfs((prevPdfs) =>
      [...prevPdfs].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleRemovePDF = (index: number) => {
    setPdfs((prevPdfs) => {
      const newPdfs = [...prevPdfs];
      newPdfs.splice(index, 1);
      return newPdfs;
    });
  };

  const handleMergedPdfNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMergedPdfName(e.target.value);
  };

  const handleMergePDFs = async () => {
    const mergedPdf = await PDFDocument.create();
    for (const pdf of pdfs) {
      const fileReader = new FileReader();
      const pdfBytes = await new Promise<Uint8Array>((resolve) => {
        fileReader.onload = () => {
          const bytes = new Uint8Array(fileReader.result as ArrayBuffer);
          resolve(bytes);
        };
        fileReader.readAsArrayBuffer(pdf);
      });
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = mergedPdfName;
    link.click();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('index'));
    const newPdfs = [...pdfs];
    const dragItem = newPdfs[dragIndex];
    newPdfs.splice(dragIndex, 1);
    newPdfs.splice(index, 0, dragItem);
    setPdfs(newPdfs);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
          {pdfs.map((pdf, index) => (
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
};

export default PDFHome;
