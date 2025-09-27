'use client';
import styles from './FeatureSelect.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { usePlansStore } from '@/state/plans';
import FeaturePlanCard, { FeaturePlan } from './components/featurePlanCard/FeaturePlanCard.component';
import { Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  onContinue: () => void;
};

const FeatureSelect = ({ onContinue }: Props) => {
  const { data: loggedInUser } = useUser();
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;

  const { data: plansRequest } = useApiHook({
    url: `/auth/plan`,
    key: 'plan-select',
    method: 'GET',
    enabled: !!loggedInUser?._id,
    filter: `availableTo;{"$in":"athlete"}|isActive;true`,
  }) as any;

  const { selectedPlans, togglePlan, billingCycle, setBillingCycle } = usePlansStore();

  const plans: FeaturePlan[] = plansRequest?.payload?.data || plansRequest?.payload || plansRequest?.data || [];
  const sortPlansOnPrice = (plans: FeaturePlan[]) => {
    return plans.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return priceA - priceB;
    });
  };

  const sortedPlans = sortPlansOnPrice(plans);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Select Your Feature Plan</h2>
          <p className={styles.description}>Choose the features you&apos;d like to include in your account.</p>

          <div className={styles.billingToggle}>
            <button className={`${styles.toggleOption} ${billingCycle === 'monthly' ? styles.active : ''}`} onClick={() => setBillingCycle('monthly')}>
              Monthly
            </button>
            <div className={styles.separator} />
            <button className={`${styles.toggleOption} ${billingCycle === 'yearly' ? styles.active : ''}`} onClick={() => setBillingCycle('yearly')}>
              Yearly
            </button>
          </div>
        </div>
        <div className={styles.plans}>
          {sortedPlans.map((plan: FeaturePlan) => (
            <FeaturePlanCard key={plan._id} plan={plan} selected={selectedPlans.some((p) => p._id === plan._id)} onSelect={() => togglePlan(plan)} billingCycle={billingCycle} />
          ))}
        </div>

        {!profile.payload.setupFeePaid && (
          <p>
            <strong>There is a one-time, non-refundable setup fee of $50 that will be added to your initial payment.</strong>
          </p>
        )}

        <p className={styles.info}>*Prices shown do not include applicable taxes.</p>
      </div>
      <div className={styles.footer}>
        <Button type="primary" onClick={onContinue} disabled={selectedPlans.length === 0} size="large">
          {selectedPlans.length === 0 ? 'Select a plan' : `Continue with ${selectedPlans[0].name} plan`}
        </Button>
      </div>
    </div>
  );
};

export default FeatureSelect;
