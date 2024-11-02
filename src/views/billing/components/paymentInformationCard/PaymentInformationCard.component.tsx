import Error from "@/components/error/Error.component";
import { useUser } from "@/state/auth";
import { Button, Descriptions, Empty, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditPaymentInfoModal from "../editPaymentInfoModal/EditPaymentInfoModal.component";
import styles from "./PaymentInformationCard.module.scss";
import useFetchData from "@/state/useFetchData";

/**
 * @description - This component displays the user's current billing information, & the user can edit their payment credentials CC & ACH.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Ethan Cannelongo
 * @lastModifiedOn 06/23/2023
 */

type Props = {};

const PaymentInformationCard = (props: Props) => {
  const router = useRouter();

  const { data: userDetails } = useUser();
  const {
    data: billingData,
    error,
    isLoading,
    isError,
  } = useFetchData({
    url: `/billing/${userDetails?.user?._id}`,
    key: "billingData",
    enabled: !!userDetails?.user?._id,
  });
  const [editPaymentModalOpen, setEditPaymentModalOpen] = useState(router.query.paymentInfoOpen === "true" || false);

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <>
      <EditPaymentInfoModal open={editPaymentModalOpen} setOpen={setEditPaymentModalOpen} />

      <div className={styles.buttonContainer}>
        <Button type="dashed" onClick={() => setEditPaymentModalOpen(true)}>
          {billingData?._doc?.success === false ? "Add Payment Information" : "Edit Payment Information"}
        </Button>
      </div>
      {billingData?._doc?.success === false ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="You currently do not have any payment information on file."
        />
      ) : (
        <div>
          <div className={styles.container}>
            <Descriptions title="Billing Information" size="small">
              <Descriptions.Item label="Name">
                {billingData?._doc?.billingInfo[0]?.first_name}
                {billingData?._doc?.billingInfo[0]?.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{billingData?._doc?.billingEmail}</Descriptions.Item>
              <Descriptions.Item label="Phone #">{billingData?._doc?.billingInfo[0]?.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {billingData?._doc?.billingInfo[0]?.address + "," || "N/A"}{" "}
                {billingData?._doc?.billingInfo[0]?.city + "," || "N/A"}{" "}
                {billingData?._doc?.billingInfo[0]?.state + ", " || "N/A"}
                {billingData?._doc?.billingInfo[0]?.zip || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {!billingData?._doc?.isCC && (
            <div className={styles.container}>
              <Descriptions title="Payment Method" size="small">
                <Descriptions.Item label="ACH Account Number">{billingData?._doc?.checkaccount}</Descriptions.Item>
                <Descriptions.Item label="ACH ABA/Routing Number">{billingData?._doc?.checkaba}</Descriptions.Item>
              </Descriptions>
            </div>
          )}
          {billingData?._doc?.isCC && (
            <div className={styles.container}>
              <Descriptions title="Payment Method" size="small">
                <Descriptions.Item label="Credit Card Number">{billingData?._doc?.ccnumber}</Descriptions.Item>
                <Descriptions.Item label="Credit Card Expiration Date">
                  {
                    // we need to format the expiration date to MM/YYYY
                    billingData?._doc?.ccexp?.substring(0, 2) + "/" + billingData?._doc?.ccexp?.substring(2, 6)
                  }
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
          {!billingData?._doc && (
            <div className={styles.container}>
              <Descriptions title="Payment Method" size="small">
                <Descriptions.Item>No payment method on file.</Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PaymentInformationCard;
