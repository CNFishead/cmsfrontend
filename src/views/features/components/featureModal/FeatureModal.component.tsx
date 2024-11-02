import { Modal } from "antd";
import styles from "./FeatureModal.module.scss";
import { useUser } from "@/state/auth";
// import {
//   useAllFeatures,
//   useUpdateUserFeatures,
// } from '@/state/features/features';
import Loader from "@/components/loader/Loader.component";
import { getPrice } from "@/utils/getPrice";

type Props = {
  selectedFeatures: {
    _id: string;
    name: string;
    description: string;
    price: number;
  }[];
  setSelectedFeatures?: (features?: any) => void;
  hasFeature: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const FeatureModal = (props: Props) => {
  const text = props.hasFeature
    ? "Are you sure you want to remove this feature?"
    : "Are you sure you want to add these features?";

  const { data: loggedInData } = useUser();
  // const { data: featuresData } = useAllFeatures();
  // const { mutate: updateUserFeatures, isLoading: updateIsLoading } = useUpdateUserFeatures(() => {
  //   props.setSelectedFeatures && props.setSelectedFeatures([]);
  //   props.setOpen(false);
  // });

  return (
    <Modal
      className={styles.container}
      open={props.open}
      okText={props.hasFeature ? "Confirm Remove" : "Confirm Add"}
      okButtonProps={{
        danger: props.hasFeature,
        // style: updateIsLoading ? { display: "none" } : {},
      }}
      cancelButtonProps={
        {
          // style: updateIsLoading ? { display: "none" } : {}
        }
      }
      onCancel={() => props.setOpen(false)}
      onOk={() => {
        // updateUserFeatures(
        //   props.hasFeature
        //     ? loggedInData.user.features.filter((f: any) => !props.selectedFeatures.map((f: any) => f._id).includes(f))
        //     : [...loggedInData.user.features, ...props.selectedFeatures.map((f) => f._id)]
        // );
      }}
    >
      {/* {updateIsLoading ? (
        <div>
          <Loader title="Please wait while we make those changes" />
        </div>
      ) : (
        <>
          <div className={styles.textContainer}>
            <h1 className={styles.text}>{text}</h1>
          </div>
          {props.selectedFeatures.map((f) => (
            <div className={`${styles.feature} ${f.price < 0 && styles.discount}`}>
              <h1 className={styles.title}>{f.name}</h1>
              <p className={styles.description}>{f.description}</p>
              <h1 className={styles.price}>${f.price}</h1>
            </div>
          ))}

          <h1 className={styles.priceDiff}>
            Your monthly price will be changed to{" "}
            <span>
              $
              {!props.hasFeature
                ? getPrice(
                    [
                      ...featuresData?.allFeatures.filter((f: any) => loggedInData.user.features.includes(f._id)),
                      ...props.selectedFeatures,
                    ],
                    loggedInData.user
                  )
                : (
                    getPrice(
                      featuresData?.allFeatures.filter((f: any) => loggedInData.user.features.includes(f._id)),
                      loggedInData.user
                    ) -
                    getPrice(props.selectedFeatures, loggedInData.user, {
                      noCredits: true,
                    })
                  ).toFixed(2)}
            </span>
          </h1>
        </>
      )} */}
    </Modal>
  );
};

export default FeatureModal;
