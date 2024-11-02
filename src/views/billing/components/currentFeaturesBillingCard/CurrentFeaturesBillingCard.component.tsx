import Error from "@/components/error/Error.component";
// state
import { useUser } from "@/state/auth";
import { Button, Col, Descriptions, Row, Skeleton } from "antd";
import Link from "next/link";
import { useState } from "react";

import styles from "./CurrentFeaturesBillingCard.module.scss";

/**
 * @description - This component displays the user's current features. It is a card component that is used in the billing page.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 05/25/2023
 */

type Props = {};
const CurrentFeaturesBillingCard = (props: Props) => {
  // const { data: paymentData, error, isLoading, isError } = useNextPaymentDate();
  const { data: loggedInData } = useUser();
  // const { data: featuresData } = useAllFeatures();

  // if (isLoading) return <Skeleton active />;
  // if (isError) return <Error error={error} />;
  const DateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <div className={styles.container}>
      <Descriptions
        title="Current Features"
        className={styles.desc}
        bordered
        extra={
          <Link href="/features">
            <Button type="dashed">Update Features</Button>
          </Link>
        }
      >
        {/* {featuresData?.allFeatures.map((feature: any, index: number) => {
          if (loggedInData?.user.features.includes(feature._id)) {
            return (
              <Descriptions.Item label={feature.name} key={feature._id} span={2}>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(feature.price)}
              </Descriptions.Item>
            );
          }
        })} */}
      </Descriptions>

      <Descriptions title="Payment Information" className={styles.desc}>
        <Descriptions.Item className={styles.total} label="Next Payment Amount">
          <></>
          {/* {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(paymentData?.data?.nextPaymentAmount - loggedInData?.user?.credits)}{" "}
          on {DateTimeFormat.format(new Date(paymentData?.data?.nextPaymentDate))} */}
        </Descriptions.Item>
        <Descriptions.Item label="Credits being used" span={2}>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(loggedInData?.user?.credits || "0")}
        </Descriptions.Item>
        <Descriptions.Item label="Discount being used">
          {loggedInData?.user.discount ? loggedInData?.user.discount : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CurrentFeaturesBillingCard;
