import Container from "@/layout/container/Container.layout";
import { useUser } from "@/state/auth";
// import { useAllFeatures } from "@/state/features/features";
import { getPrice } from "@/utils/getPrice";
import { FEATURES } from "@/utils/hasFeature";
import EditPaymentInfoModal from "@/views/billing/components/editPaymentInfoModal/EditPaymentInfoModal.component";
import { Button, Empty, message, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// import Feature from "./components/feature/Feature.component";
import FeatureModal from "./components/featureModal/FeatureModal.component";
import styles from "./Features.module.scss";
// import { useBillingData } from "@/state/billing/billing";
import FeatureType from "@/types/FeatureType";

const FeaturesView = () => {
  // const { data: featuresData, isLoading } = useAllFeatures();
  const { data: loggedInData } = useUser();
  // const { data: billingData } = useBillingData();

  const [selectedFeatures, setSelectedFeatures] = React.useState<any[]>([]);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const addDiscounts = () => {
    const discountFeatures: any[] = [];
    console.log("selectedFeatures", selectedFeatures);
    const currentFeatures = [...selectedFeatures.map((f) => f._id), ...loggedInData.user.features];

    //Add on core feature discount
    if (
      currentFeatures.includes("6328aadfd0c3abb536eae7ad") &&
      currentFeatures.includes("632b65745ddb31bf9714ef69") &&
      !(
        loggedInData.user.features.includes("63457a948c492c0963977ab6") &&
        loggedInData.user.features.includes("632b65745ddb31bf9714ef69")
      )
    ) {
      // discountFeatures.push(featuresData?.allFeatures.find((f: any) => f._id === "63457a948c492c0963977ab6"));
    }

    return discountFeatures;
  };

  // if (isLoading) return <Skeleton active />;
  return (
    <div className={styles.container}>
      <FeatureModal
        selectedFeatures={[...selectedFeatures, ...addDiscounts()]}
        setSelectedFeatures={setSelectedFeatures}
        hasFeature={false}
        open={modalOpen}
        setOpen={setModalOpen}
      />

      {/* 
      Find all features that are in the user's features array
      and map them to the Feature component
        */}
      <Container title="Your Features">
        <div className={styles.features}>
          {/* {featuresData?.allFeatures
            .filter((f: any) => loggedInData.user.features.includes(f._id))
            .map((feature: FeatureType, index: any) => {
              return (
                <Feature
                  feature={feature}
                  key={index}
                  hasFeature
                  isDiscount={feature.price < 0}
                  setSelectedFeatures={setSelectedFeatures}
                />
              );
            })} */}
        </div>
        <div className={styles.price}>
          <h1 className={styles.total}>Your monthly payment:</h1>
          <h1 className={styles.totalPrice}>
            $
            {/* {getPrice(
              featuresData?.allFeatures.filter((f: any) => loggedInData.user.features.includes(f._id)),
              loggedInData.user
            )} */}
            /Month
          </h1>
          {loggedInData.user.credits > 0 && (
            <h1 className={styles.totalPrice}>(Includes -${loggedInData.user.credits.toFixed(2)} in credits)</h1>
          )}
        </div>
      </Container>
      <Container title="Available Features to Add">
        {/* {featuresData?.availableFeatures.filter((f: any) => !loggedInData.user.features.includes(f._id)).length ===
          0 && (
          <Empty
            description={<span>You have all the features available to you.</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )} */}

        {/* 
        Find all features that are not in the user's features array
        and map them to the Feature component
        */}
        <div className={styles.features}>
          {/* {featuresData?.availableFeatures
            .filter((f: any) => !loggedInData.user.features.includes(f._id))
            .map((feature: FeatureType) => {
              return (
                <Feature
                  feature={feature}
                  key={feature._id}
                  setSelectedFeatures={setSelectedFeatures}
                  selectedFeatures={selectedFeatures}
                  isSelected={selectedFeatures.includes(feature)}
                />
              );
            })} */}
          {/* {addDiscounts().map((feature) => {
            return <Feature feature={feature} key={feature._id} isDiscount />;
          })} */}
        </div>
        <div className={styles.price}>
          <h1 className={styles.total}>Total:</h1>
          <h1 className={styles.totalPrice}>
            +$
            {getPrice(selectedFeatures, loggedInData.user, {
              noCredits: true,
            })}
            /Month
          </h1>

          <Button
            onClick={() => {
              // if (billingData?.success) {
              //   setModalOpen(true);
              // } else {
              //   router.push("/billing?paymentInfoOpen=true");
              //   message.warning("You must add payment information before adding features.");
              // }
            }}
            type="primary"
            disabled={selectedFeatures.length === 0}
            className={styles.checkoutBtn}
          >
            Checkout ({selectedFeatures.length}) Features
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default FeaturesView;
