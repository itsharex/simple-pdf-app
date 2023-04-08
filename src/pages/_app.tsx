import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Sidebar from './sidebar';
import { useState } from 'react';
import PDFMerger from './pdfmerger';

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isPdfMerger = Component === PDFMerger;

  return (
    <div className="app-container">
      {!isPdfMerger && (
        <>
          <Sidebar open={sidebarOpen} />
          <button className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
            {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          </button>
        </>
      )}
      <div className="main-container">
        <Component {...pageProps} />
      </div>
    </div>
  );  
}
