import { CreditCard, Banknote } from 'lucide-react';
import styles from './PaymentSummary.module.scss';

const PaymentSummary = (paymentFormValues: any) => {
  if (!paymentFormValues) return null;

  const isCard = paymentFormValues.type === 'creditcard';
  const isACH = paymentFormValues.type === 'ach';
  const isStripe = paymentFormValues.stripeToken; // Check if Stripe token exists

  // If Stripe is being used, show Stripe-specific summary
  if (isStripe) {
    return (
      <div className={styles.paymentSummary}>
        <div className={styles.header}>
          <CreditCard size={20} />
          <h3>Payment Method</h3>
        </div>
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Payment Handler</span>
            <span className={styles.value}>Stripe (Secure Payment Processing)</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cardholder</span>
            <span className={styles.value}>{`${paymentFormValues?.first_name} ${paymentFormValues?.last_name}`.trim()}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <span className={styles.value}>✓ Card information secured</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentSummary}>
      <div className={styles.header}>
        {isCard ? <CreditCard size={20} /> : <Banknote size={20} />}
        <h3>{isCard ? 'Credit / Debit Card' : 'ACH / Bank Transfer'}</h3>
      </div>

      <div className={styles.details}>
        {isCard && (
          <>
            <div className={styles.row}>
              <span className={styles.label}>Cardholder</span>
              <span className={styles.value}>{`${paymentFormValues?.first_name} ${paymentFormValues?.last_name}`.trim()}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Card Number</span>
              <span className={styles.value}>{maskCardNumber(paymentFormValues?.ccnumber)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Expiration</span>
              <span className={styles.value}>{paymentFormValues?.ccexp}</span>
            </div>
          </>
        )}

        {isACH && (
          <>
            <div className={styles.row}>
              <span className={styles.label}>Account Holder</span>
              <span className={styles.value}>{paymentFormValues?.accountHolderName}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Account Number</span>
              <span className={styles.value}>{maskAccountNumber(paymentFormValues?.accountNumber)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Routing Number</span>
              <span className={styles.value}>{paymentFormValues?.routingNumber}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;

const maskCardNumber = (ccnumber: string) => {
  const last4 = ccnumber?.slice(-4);
  return `**** **** **** ${last4}`;
};

const maskAccountNumber = (accountNumber: string) => {
  const last4 = accountNumber?.slice(-4);
  return `****${last4}`;
};
