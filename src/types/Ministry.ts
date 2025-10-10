import MemberType from "./MemberType";
import User from "./User";

export interface TeamMember {
  user: User;
  role: string;
}
export default interface MinistryType {
  _id: string;
  user: string;
  name: string;
  description: string;
  donationLink: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  ministryType: string;
  leader: MemberType;
  ministryImageUrl: string;
  members: MemberType[];
  events: string[];
  announcements: string[];
  ownerMinistry: string;
  isMainMinistry: boolean;
  admins: string[];
  leaders: string[];
  linkedUsers: TeamMember[]; // References to users with access
  createdAt: Date;
  updatedAt: Date;
  isSubMinistry: boolean;
}
