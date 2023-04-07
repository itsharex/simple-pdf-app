import React from 'react';
import styles from '@/styles/sidebar.module.css';

type SidebarProps = {
  open: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  return (
    <div className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <ul>
        <li>
          <button className={styles.toolButton}>Tool 1</button>
        </li>
        <li>
          <button className={styles.toolButton}>Tool 2</button>
        </li>
        <li>
          <button className={styles.toolButton}>Tool 3</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
