import { Button } from 'antd';
import styles from './SaveButton.module.scss';

type Props = {
  isLoading?: boolean;
};

const SaveButton = (props: Props) => {
  return (
    <Button
      type="primary"
      htmlType="submit"
      className={styles.save}
      loading={props.isLoading}
    >
      Save
    </Button>
  );
};

export default SaveButton;
