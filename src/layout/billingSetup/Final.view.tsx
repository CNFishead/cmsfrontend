import { useState } from "react";
import styles from "./FeatureSelect.module.scss";
import { usePaymentStore } from "@/state/payment";
import { usePlansStore } from "@/state/plans";
import useApiHook from "@/hooks/useApi";
import { Button, Tag } from "antd";
import FeaturePlanCard from "./components/featurePlanCard/FeaturePlanCard.component";
import PaymentSummary from "./components/paymentSummary/PaymentSummary.component";
import { useUser } from "@/state/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

type Props = {
  onPrevious(): void;
};
const Final = ({ onPrevious }: Props) => {
  const { paymentFormValues, paymentMethod } = usePaymentStore();
  const { data: loggedInUser } = useUser();
  const { billingCycle, selectedPlans } = usePlansStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedProfile } = useSelectedProfile();

  const { mutate: updateBilling } = useApiHook({
    key: "billing",
    method: "POST",
    queriesToInvalidate: ["user"],
  }) as any;

  const handleSubmit = async () => {
    if (!paymentFormValues) {
      setError("Missing payment information.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await updateBilling({
        url: `/payment/${selectedProfile?._id}`,
        formData: { paymentFormValues, billingCycle, selectedPlans, paymentMethod },
      });
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
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
            <FeaturePlanCard key={plan._id} plan={plan} billingCycle={billingCycle} showActions={false} />
          ))}
        </div>

        {/* only show if not free */}
        {!selectedPlans?.some((plan) => plan.price === 0) && (
          <PaymentSummary {...paymentFormValues} type={paymentMethod} />
        )}

        {!selectedPlans?.some((plan) => plan.price === 0) &&
          selectedPlans?.map((plan) => {
            const cycle = billingCycle === "yearly" ? "Year" : "Month";
            const yearlyDiscount = plan.yearlyDiscount ?? 0;
            const basePrice = plan.price;

            const price = cycle === "Year" ? basePrice * 12 * ((100 - yearlyDiscount) / 100) : basePrice;

            return (
              <div key={plan._id} className={styles.plan}>
                <p className={styles["plan-header"]}>{cycle}ly Plan</p>
                <p className={`${styles.price} ${styles["price--highlight"]}`}>
                  Every {cycle}: <strong>${price.toFixed(2)}</strong>
                </p>
                <p className={styles.terms}>
                  All prices are listed in USD. Your subscription will automatically renew at the beginning of each{" "}
                  {cycle.toLowerCase()} billing period. To cancel your subscription, please manage your account settings
                  or contact our support team with a cancellation request. Cancellation policies and any applicable
                  refunds are governed by our{" "}
                  <a href="https://shepherdcms.org/legal/refund" target="_blank" rel="noreferrer">
                    Refund Policy
                  </a>
                  . Please review this policy for complete details regarding cancellations and refund eligibility.
                </p>
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Final;
