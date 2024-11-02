import FeatureType from "./FeatureType";

export default interface User {
  token: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  ministry: {
    name: string;
    id: string;
    ministryImageUrl: string;
  };
  role: string;
  username: string;
  id: string;
  _id: string;
  phoneNumber: string;
  features: FeatureType[];
}
