import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';
import PaymentInformationForm from '@/views/billing/components/paymentInformation/PaymentInformation.component';
import { usePaymentStore } from '@/state/payment';

type Props = {
  onContinue(): void;
  onPrevious(): void;
};

const PaymentWrapper = ({ onContinue, onPrevious }: Props) => {
  const { paymentFormValues } = usePaymentStore();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Payment Information</h2>
          <p className={styles.description}>Please provide your payment information.</p>
        </div>
        <PaymentInformationForm />
      </div>
      <div className={styles.footer}>
        <Button type="primary" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="primary" onClick={onContinue} disabled={!Object.keys(paymentFormValues).length}>
          Continue
        </Button>
      </div>
    </>
  );
};

export default PaymentWrapper;
