import Error from "@/components/error/Error.component";
// state
import { useUser } from "@/state/auth";
import { Button, Col, Descriptions, Row, Skeleton } from "antd";
import Link from "next/link";
import { useState } from "react";

import styles from "./CurrentFeaturesBillingCard.module.scss";
import useApiHook from "@/hooks/useApi";
import moment from "moment";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import useBilling from "../../hooks/useBilling";

/**
 * @description - This component displays the user's current features. It is a card component that is used in the billing page.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 05/25/2023
 */

const CurrentFeaturesBillingCard = () => {
  const { selectedProfile } = useSelectedProfile();
  const { data: billingData, isLoading } = useBilling();
  if (isLoading) return <Skeleton active />;
  // if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <Descriptions
        title="Current Plan"
        className={styles.desc}
        bordered
        extra={
          <Link href="/features">
            <Button type="dashed" disabled>
              Update Features
            </Button>
          </Link>
        }
      >
        <Descriptions.Item label="Plan">{billingData?.plan?.name}</Descriptions.Item>
        <Descriptions.Item label="Price">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(billingData?.plan?.price as any as number)}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Plan Information" className={styles.desc}>
        <Descriptions.Item className={styles.total} label="Next Payment Amount">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(
            billingData?.isYearly
              ? (billingData?.plan?.price as any as number) * 12
              : (billingData?.plan?.price as any as number)
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Next Billing Date">
          {moment(billingData?.nextBillingDate).format("MM/DD/YYYY").toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Cycle">{billingData?.isYearly ? "Yearly" : "Monthly"}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CurrentFeaturesBillingCard;
