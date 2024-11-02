import MemberType from "./MemberType";
import User from "./User";

export default interface FamilyType {
  _id: string;
  name: string;
  user: User;
  members: MemberType[];
  contact: MemberType;
  notes: string[];
  tags: string[];
}
