import { useRouter } from 'next/router';
import styles from '@/styles/home.module.css';

const Home: React.FC = () => {
  const router = useRouter();

  const handleNavigateToMerger = () => {
    router.push('/pdfmerger');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to My PDF Tools</h1>
      <div className={styles.pdfButtonContainer}>
        <button className={styles.pdfButton} onClick={handleNavigateToMerger}>
          Merge PDFs
        </button>
        <a href="#" download>
          <button className={styles.downloadAppButton}>Download App</button>
        </a>
        <a
          href="https://github.com/username/my-pdf-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.githubIcon}></span>
        </a>
      </div>
    </div>
  );
};

export default Home;
