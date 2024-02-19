import toolstyles from '../styles/tools.module.css';
import styles from '../styles/home.module.css';
import ToolsInfo from '../tools/ToolsInfo';

const HomePage: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>Simple PDF App</header>
      <div className={toolstyles.toolsContainer}>
        {ToolsInfo.map((tool, index) => (
          <div key={index} className={toolstyles.toolBox}>
            <h3 className={toolstyles.title}>{tool.title}</h3>
            <div
              className={toolstyles.toolIcon}
              style={{ backgroundImage: `url(${tool.previewImage})` }}
            />
            <p>{tool.desc}</p>
            <a href={tool.link} className={toolstyles.toolButton}>
              Go to Tool
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
