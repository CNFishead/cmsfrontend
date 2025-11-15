import styles from './Control.module.scss';
import { ReactNode, useState, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useLayoutStore } from '@/state/layout';

type Props = {
  navigation: Array<ControlNavItem>;
};
export interface ControlNavItem {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  hideIf?: boolean;
  disabled?: boolean;
}

const Control = (props: Props) => {
  const [currentControlPage, setCurrentControlPage] = useState<ControlNavItem>(props.navigation[0]);
  const controlLayoutCollapsed = useLayoutStore((state) => state.controlLayoutCollapsed);
  const toggleControlLayoutCollapsed = useLayoutStore(
    (state) => state.toggleControlLayoutCollapsed
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${!isMobile && controlLayoutCollapsed ? styles.collapsed : ''}`}
    >
      <div className={styles.container}>
        {currentControlPage.title && (
          <div className={styles.header}>
            <h1 className={styles.title}>{currentControlPage.title}</h1>
          </div>
        )}
        <div className={styles.children}>{currentControlPage.children}</div>
      </div>

      <div className={styles.navigationContainer}>
        {!isMobile && (
            <div
              className={`${styles.navigationItem} ${styles.collapseItem}`}
              onClick={toggleControlLayoutCollapsed}
            >
              <div className={styles.icon}>
                {controlLayoutCollapsed ? <LeftOutlined /> : <RightOutlined />}
              </div>
            </div>
        )}

        {props.navigation
          .filter((i) => !i.hideIf)
          .map((item, index) => {
            return (
              <Tooltip title={item.title} placement="left" key={index + item.title}>
                <div
                  key={index}
                  className={`${styles.navigationItem} ${
                    currentControlPage.title === item.title && styles.active
                  }`}
                  onClick={() => setCurrentControlPage(item)}
                >
                  <div className={styles.icon}>{item.icon}</div>
                </div>
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
};

export default Control;
