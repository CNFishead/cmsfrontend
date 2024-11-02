import User from "./User";

export default interface FeatureType {
  name: string;
  price: number;
  description: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  isInactive: boolean;
  user: User;
  // relies on, is a reference to another Feature of FeatureType that the user needs to have in order to have this feature
  reliesOn: FeatureType;
}
