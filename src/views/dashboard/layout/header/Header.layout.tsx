import { useUser } from '@/state/auth';
import styles from './Header.module.scss';

type Props = {};

const Header = (props: Props) => {
  const { data: loggedInData } = useUser();
  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.text}>
          Welcome <span>{loggedInData?.user?.profile?.organizationName}</span>
        </h1>
        <p>What would you like to do today?</p>
      </div>
    </div>
  );
};

export default Header;
