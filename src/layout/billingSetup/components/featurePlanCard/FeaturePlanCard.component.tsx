'use client';

// import { CheckCircle } from 'lucide-react';
import styles from './FeaturePlanCard.module.scss';

export type Tier = 'silver' | 'gold' | 'platinum';

export type FeaturePlan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: { name: string }[];
  tier: Tier;
  mostPopular?: boolean;
  yearlyDiscount?: number;
};

interface Props {
  plan: FeaturePlan;
  billingCycle: 'monthly' | 'yearly';
  selected?: boolean;
  onSelect?: () => void;
}

const FeaturePlanCard = ({ plan, billingCycle, onSelect, selected }: Props) => {
  const isYearly = billingCycle === 'yearly';
  const yearlyDiscount = plan.yearlyDiscount ?? 0;
  const basePrice = plan.price;

  const price = isYearly ? basePrice * 12 * ((100 - yearlyDiscount) / 100) : basePrice;

  return (
    <div className={`${styles.container} ${selected ? styles.active : ''} ${styles[plan.tier]} ${plan.mostPopular ? styles.mostPopular : ''}`} onClick={onSelect}>
      {plan.mostPopular && <div className={styles.popularBadge}>Most Popular</div>}

      <h3 className={styles.name}>{plan.name}</h3>
      <p className={styles.description}>{plan.description}</p>

      <div className={styles.priceRow}>
        <span className={styles.price}>${price.toFixed(0)}</span>
        <span className={styles.billingCycle}>/{isYearly ? 'year' : 'month'}</span>
        {isYearly && yearlyDiscount > 0 && <div className={styles.discountText}>Save {yearlyDiscount}% annually</div>}
      </div>

      <ul className={styles.featureList}>
        {plan.features.map((feature, i) => (
          <li key={i} className={styles.featureItem}>
            ✅ <span>{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturePlanCard;
