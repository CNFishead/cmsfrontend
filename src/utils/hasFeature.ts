import FeatureType from "@/types/FeatureType";
import User from "@/types/User";
import { useQueryClient } from "@tanstack/react-query";
//create a utility function to check if a feature is enabled on a specific user object given the feature name and the user Id as arguments to the function call and return a boolean value of true or false depending on if the feature is enabled or not.  This function will be used in the client side to determine if a feature is enabled or not and if it is enabled then we will render the component that is associated with that feature.

export const FEATURES = {
  LIVESTREAMING: {
    idArray: ["6328aadfd0c3abb536eae7ad", "6331e2f03ac502edbaf64500"],
    name: "Live Streaming",
  } as any,
  VOD: {
    idArray: ["632b65745ddb31bf9714ef69", "6331e2f93ac502edbaf64503"],
    name: "Video On Demand",
  } as any,
  MULTICASTING: {
    idArray: ["632b65a05ddb31bf9714ef6c", "6331e2e63ac502edbaf644fd"],
    name: "Multicasting",
  } as any,
  CORE_FEATURE_DISCOUNT: {
    idArray: ["63457a948c492c0963977ab6"],
    name: "Core Feature Discount",
  } as any,
};

export const hasFeature = (user: User, ...features: any) => {
  let yesFeature = false;
  if (!features) return true;
  try {
    if (user) {
      user.features.forEach((feature) => {
        // set yesFeature to true if the feature is found in the user.features array
        features.map((f: any) =>
          f.idArray.forEach((featureName: any) => {
            // console.log(feature, featureName);
            if (feature === featureName) {
              yesFeature = true;
            }
          })
        );
      });
    }

    return yesFeature;
  } catch {
    return false;
  }
};
