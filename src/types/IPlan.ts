import { IFeature } from "./IFeature";

export interface IPlan {
  _id: string;
  name: string;
  description: string;
  price: string;
  yearlyDiscount: number;
  billingCycle: string;
  availableTo: string[];
  tier: string;
  features: IFeature[];
  isActive: boolean;
  mostPopular: boolean;
}
