// import { Badge, Button, Modal, message } from "antd";
// import styles from "./Feature.module.scss";
// import FeatureModal from "../featureModal/FeatureModal.component";
// import { useState } from "react";
// import { AiFillCheckCircle } from "react-icons/ai";
// import { useUser } from "@/state/auth";
// import FeatureType from "@/types/FeatureType";

// type Props = {
//   feature: FeatureType;
//   hasFeature?: boolean;
//   isSelected?: boolean;
//   isDiscount?: boolean;
//   setSelectedFeatures?: (features?: any) => void;
//   selectedFeatures?: any;
// };

// const Feature = (props: Props) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   // const { data: featuresData } = useAllFeatures();
//   const { data: loggedInData } = useUser();

//   const reliesOnFeatureIsSelected = () => {
//     var add = false;
//     if (Boolean(props.feature.reliesOn)) {
//       props.selectedFeatures.forEach((f: any) => {
//         if (props.feature.reliesOn == f._id) add = true;
//       });
//       loggedInData.user.features.forEach((f: any) => {
//         if (props.feature.reliesOn == f) add = true;
//       });
//     } else return true;
//     return add;
//   };

//   const getSelectedFeatures = () => {
//     var featuresToRemove = [props.feature];

//     // featuresData.allFeatures.forEach((f: any) => {
//     //   if (f.reliesOn == props.feature._id) {
//     //     if (loggedInData.user.features.includes(f._id)) {
//     //       featuresToRemove.push(f);
//     //     }
//     //   }
//   }
  

//     //remove core feature discount
//     // if (loggedInData.user.features.includes("63457a948c492c0963977ab6")) {
//     //   if (
//     //     featuresToRemove.find((f) => f._id == "6328aadfd0c3abb536eae7ad") ||
//     //     featuresToRemove.find((f) => f._id == "632b65745ddb31bf9714ef69")
//     //   ) {
//     //     featuresToRemove.push(featuresData.allFeatures.find((f: any) => f._id == "63457a948c492c0963977ab6"));
//     //   }
//     // }

//     // return featuresToRemove;
//   };

//   return (
//     <>
//       {!props.isDiscount && (
//         <FeatureModal
//           selectedFeatures={getSelectedFeatures()}
//           hasFeature={props.hasFeature || false}
//           open={modalOpen}
//           setOpen={setModalOpen}
//           setSelectedFeatures={props.setSelectedFeatures}
//         />
//       )}
//       <div
//         className={`${styles.container} ${!props.hasFeature && styles.available} ${
//           props.isDiscount && styles.discount
//         } ${props.isSelected && styles.selected}`}
//       >
//         <div className={styles.header}>
//           {props.isSelected && <AiFillCheckCircle className={styles.icon} />}
//           <div className={styles.details}>
//             <h1 className={styles.title}>
//               {props.feature.name}{" "}
//               {props.feature.reliesOn && (
//                 <Badge>
//                   This feature relies on the{" "}
//                   {featuresData.allFeatures.find((f: any) => f._id == props.feature.reliesOn).name} feature.
//                 </Badge>
//               )}
//             </h1>
//             <p className={styles.description}>{props.feature.description}</p>
//           </div>
//         </div>
//         <div className={styles.options}>
//           <h1 className={styles.price}>{!props.isDiscount ? `+$${props.feature.price}` : `$${props.feature.price}`}</h1>
//           {!props.isDiscount && (
//             <>
//               {!props.hasFeature ? (
//                 <Button
//                   type="dashed"
//                   onClick={() => {
//                     if (props.isSelected)
//                       props.setSelectedFeatures &&
//                         props.setSelectedFeatures(
//                           props.selectedFeatures.filter(
//                             (f: any) => f._id !== props.feature._id && f.reliesOn !== props.feature._id
//                           )
//                         );
//                     else {
//                       if (reliesOnFeatureIsSelected())
//                         props.setSelectedFeatures &&
//                           props.setSelectedFeatures([...props.selectedFeatures, props.feature]);
//                       else {
//                         Modal.error({
//                           title: "Feature not available",
//                           content: `You must add the ${
//                             featuresData.allFeatures.find((f: any) => f._id == props.feature.reliesOn).name
//                           } feature before adding the ${props.feature.name} feature.`,
//                         });
//                       }
//                     }
//                   }}
//                 >
//                   {!props.isSelected ? "Add to Cart" : "Remove From Cart"}
//                 </Button>
//               ) : (
//                 <Button
//                   danger
//                   type="primary"
//                   onClick={() => {
//                     setModalOpen(true);
//                   }}
//                 >
//                   Remove
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Feature;
