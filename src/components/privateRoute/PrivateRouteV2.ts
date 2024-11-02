import { useRouter } from 'next/router';
import User from "@/types/User";
// import { RootState } from '@/redux/store';
// import { AnyAction, Store } from 'redux';
// import { useSelector } from 'react-redux';

/**
 * @description - Function that checks the user in redux store and checks if the user has the appropriate permissions to view the page,
 *                if not, returns false and redirects to the login page.
 * @param {string[]} allowedRoles - An array of strings that represent the roles that are allowed to view the page
 * @param {ReduxStore} store - The redux store that contains the user object. The user object should be of type {@link User}
 * @returns {boolean} - Returns true if the user has the appropriate permissions to view the page, otherwise returns false.
 * 
 * @author Austin Howard
 * @version 1.0
 * @since 1.0
 * @dateMotified 2023-05-07T18:27:04.000-05:00
 */

interface Props {
  user: User;
}
interface AuthError {
  message: string;
  statusCode: number;
}

export const checkAuthorization = (user: User, allowedRoles: string[]) => {
  // get the user from the redux store
  // split the users role into an array of strings
  const userRoles = user?.role?.split(' ');
  // console.log(userRoles)
  // if there is no user or the user's role is not in the allowedRoles array, reject with an error object
  if (!user || !allowedRoles.some((role) => userRoles.includes(role))) {
    const error: AuthError = {
      message: 'You are not authorized to view this page',
      statusCode: 403,
    };
    return false;
  }

  // otherwise, resolve with the component's props
  return true;
};