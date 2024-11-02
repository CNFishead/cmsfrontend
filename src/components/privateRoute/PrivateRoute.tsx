import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
import User from "@/types/User";
// import { RootState } from "@/redux/store";

//make a type with children as a prop
type Props = {
  children: React.ReactNode;
  permissions: string[];
};
/**
 * @description - A private route component that checks if the user is logged in and has the required permission to access the route
 * @param {Component} children - React children, in this case, the component to be rendered
 * @param {String} permissions - The permission to be checked against the user's permissions
 *
 * @returns {JSX.Element}
 *
 * @author Austin Howard
 * @since 1.0.0
 * @version 1.0.2
 * @lastModified 2/14/2023
 * @lastModifiedBy Austin Howard
 */
const PrivateRoute = (props: Props) => {
  const router = useRouter();
  // const { user = {} as User } = useSelector((state: RootState) => state.auth);
  const { permissions } = props;
  // if the user is not logged in, redirect them to the login page
  if (typeof window !== undefined && Object.keys({}).length === 0) {
    router.push("/login");
    return <></>;
  }
  // if the user is logged in but does not have the required permission, redirect them to the home page
  // if (!permissions.includes(user?.role)) {
  //   router.push("/");
  //   return <></>;
  // }
};

export default PrivateRoute;
