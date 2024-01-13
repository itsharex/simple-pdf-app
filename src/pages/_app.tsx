import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import PDFMerger from '../components/pdfmerger';
import 'font-awesome/css/font-awesome.min.css';

export default function App({ Component, pageProps }: AppProps) {
  const isPdfMerger = Component === PDFMerger;
  return (
    <div className="app-container">
      <div className="main-container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
