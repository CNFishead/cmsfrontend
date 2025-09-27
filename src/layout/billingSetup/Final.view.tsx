import { useState } from 'react';
import styles from './FeatureSelect.module.scss';
import { usePaymentStore } from '@/state/payment';
import { usePlansStore } from '@/state/plans';
import useApiHook from '@/hooks/useApi';
import { Button, Tag } from 'antd';
import FeaturePlanCard from './components/featurePlanCard/FeaturePlanCard.component';
import PaymentSummary from './components/paymentSummary/PaymentSummary.component';
import { useUser } from '@/state/auth';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  onPrevious(): void;
};
const Final = ({ onPrevious }: Props) => {
  const { paymentFormValues, paymentMethod } = usePaymentStore();
  const { data: loggedInUser } = useUser();
  const { billingCycle, selectedPlans } = usePlansStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;

  const { mutate: updateBilling } = useApiHook({
    key: 'billing',
    method: 'POST',
    queriesToInvalidate: ['user'],
  }) as any;

  const handleSubmit = async () => {
    if (!paymentFormValues) {
      setError('Missing payment information.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await updateBilling({
        url: `/payment/${loggedInUser?.profileRefs.athlete}`,
        formData: { paymentFormValues, billingCycle, selectedPlans, paymentMethod },
      });
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Review & Submit</h2>
          <p className={styles.description}>Please review your information and submit your billing setup.</p>
        </div>
        {/* Display current selected plan and payment info */}
        <div className={styles.summary}>
          {selectedPlans?.map((plan) => (
            <FeaturePlanCard key={plan._id} plan={plan} billingCycle={billingCycle} />
          ))}
        </div>
        <PaymentSummary {...paymentFormValues} type={paymentMethod} />

        {selectedPlans?.map((plan) => {
          const cycle = billingCycle === 'yearly' ? 'Year' : 'Month';
          const yearlyDiscount = plan.yearlyDiscount ?? 0;
          const basePrice = plan.price;

          const price = cycle === 'Year' ? basePrice * 12 * ((100 - yearlyDiscount) / 100) : basePrice;

          return (
            <div key={plan._id} className={styles.plan}>
              <p className={styles['plan-header']}>
                {cycle}ly Plan
                {!profile.payload.setupFeePaid && <Tag color="blue">+ $50 One-time Setup Fee</Tag>}
              </p>

              {!profile.payload.setupFeePaid ? (
                <>
                  <p className={`${styles.price} ${styles['price--highlight']}`}>
                    First {cycle}: <strong>${50 + price}</strong>
                  </p>
                  <p className={`${styles.price} ${styles['price--muted']}`}>
                    Then every {cycle}: <strong>${price}</strong>
                  </p>
                </>
              ) : (
                <p className={`${styles.price} ${styles['price--highlight']}`}>
                  Every {cycle}: <strong>${price}</strong>
                </p>
              )}
            </div>
          );
        })}

        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.footer}>
        <Button onClick={onPrevious} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default Final;
