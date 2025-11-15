export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  customerId: string;
  profileImageUrl: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  ministry: string | null;
  fullName: string;
  isActive: boolean;
  resetPasswordToken: string | undefined | null;
  resetPasswordExpire: Date | undefined | null;
  accessKey: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  acceptedPolicies: Record<string, number>;
  permissions: string[];
  lastSignedIn: Date | undefined | null;
  emailVerificationToken: string | undefined | null;
  emailVerificationExpires: Date | undefined | null;
  profileRefs: Record<string, string | null>;
}
