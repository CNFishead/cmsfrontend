"use client";

import { useState } from "react";
// import { CheckCircle } from 'lucide-react';
import styles from "./FeaturePlanCard.module.scss";

export type Tier = "silver" | "gold" | "platinum";

export type FeaturePlan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: { name: string }[];
  tier: Tier;
  mostPopular?: boolean;
  yearlyDiscount?: number;
};

interface Props {
  plan: FeaturePlan;
  billingCycle: "monthly" | "yearly";
  selected?: boolean;
  onSelect?: () => void;
  showActions?: boolean;
}

const FeaturePlanCard = ({ plan, billingCycle, onSelect, selected, showActions = true }: Props) => {
  const { name, price, description, features, mostPopular, yearlyDiscount } = plan;
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [showAllFeatures, setShowAllFeatures] = useState<boolean>(false);

  // Truncate description to ~100 characters
  const truncatedDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;

  // Show only first 5 features initially
  const displayedFeatures = showAllFeatures ? features : features?.slice(0, 5) as any[];
  const hasMoreFeatures = features && features.length > 5;

  // Calculate pricing based on billing toggle
  const monthlyPrice = parseFloat(price as unknown as string) || 0;
  const yearlyPrice = monthlyPrice * 12 * (1 - (yearlyDiscount || 0) / 100);
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = monthlyPrice * 12 - yearlyPrice;

  const displayPrice = billingCycle === 'yearly' ? yearlyMonthlyEquivalent : monthlyPrice;
  const displayPeriod = billingCycle === 'yearly' ? "month (billed yearly)" : "month";

  return (
    <div className={`${styles.planCard} ${mostPopular ? styles.mostPopular : ""} ${selected ? styles.active : ""}`} onClick={onSelect}>
      {mostPopular && <div className={styles.popularBadge}>Most Popular</div>}
      <h3>{name}</h3>
      <div className={styles.priceContainer}>
        <div>
          <span className={styles.price}>${displayPrice.toFixed(2)}</span>
          <span className={styles.billingCycle}>/{displayPeriod}</span>
        </div>
        {billingCycle === "yearly" && (yearlyDiscount || 0) > 0 && (
          <div className={styles.yearlyDetails}>
            <p className={styles.originalPrice}>${monthlyPrice}/month</p>
            <p className={styles.savings}>
              Save ${savings.toFixed(2)}/year ({yearlyDiscount}% off)
            </p>
          </div>
        )}
      </div>
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>{showFullDescription ? description : truncatedDescription}</p>
        {description.length > 100 && (
          <button className={styles.toggleButton} onClick={() => setShowFullDescription(!showFullDescription)}>
            {showFullDescription ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className={styles.featuresContainer}>
        <h4>Included Features:</h4>
        <ul className={styles.featuresList}>
          {displayedFeatures?.map((feature) => (
            <li key={feature._id} className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              {feature.name}
            </li>
          ))}
        </ul>
        {hasMoreFeatures && (
          <button className={styles.toggleButton} onClick={() => setShowAllFeatures(!showAllFeatures)}>
            {showAllFeatures ? `Show less features` : `Show ${features.length - 5} more features`}
          </button>
        )}
      </div>
      {showActions && (
        <button className={styles.selectButton}>Choose {name}</button>
      )}
    </div>
  );
};

export default FeaturePlanCard;
