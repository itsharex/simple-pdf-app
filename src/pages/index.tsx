import Head from 'next/head';
import styles from '@/styles/home.module.css';
import { DefaultSeo } from 'next-seo';

const SEO = {
  title: 'A Very Simple PDF App',
  description: 'All-in-One PDF App 100% Free.',
  openGraph: {
    title: 'A Very Simple PDF App',
    description: 'All-in-One PDF App 100% Free.',
    url: 'https://simplepdf.vercel.app/',
    type: 'website',
    images: [
      {
        url: 'https://cdn.statically.io/gh/Sudo-Ivan/MyWebsite-Assets/main/images/website/pdfmerger/pdfmergershowcase.png',
        width: 1200,
        height: 630,
        alt: 'A Very Simple PDF App Preview',
      },
    ],
  },
};

const Home: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <Head>
        <title>My PDF App</title>
        <meta name="description" content="A collection of PDF tools" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultSeo {...SEO} />

      <header className={styles.header}>
        <h1>Welcome to My Simple PDF App</h1>
      </header>

      <main className={styles.main}>
        <p className={styles.intro}>
          My PDF Tools is a collection of tools to help you manage and edit your
          PDF files.
        </p>
        <h2 className={styles.toolsHeader}>Available Tools:</h2>
        <ul className={styles.toolsList}>
          <li>PDF Merger</li>
          <li>PDF Splitter</li>
          <li>PDF to Image</li>
          <li>Image to PDF</li>
          <li>Compress PDF</li>
          <li>Unlock PDF</li>
        </ul>
        <div className={styles.pdfButtonContainer}>
          <a href="#" download>
            <button className={styles.downloadAppButton}>
              Download Tauri App
            </button>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
