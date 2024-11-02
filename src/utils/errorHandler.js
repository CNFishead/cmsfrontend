import { logout } from "../state/auth";
import { message } from "antd";

/**
 * @description - This function is used to handle errors in the client application.
 *
 * @param {Error} error - The error object
 * @Author - Austin Howard
 * @lastModified - 2022-07-22
 * @modifiedBy - Austin Howard
 * @version - 1.0.0
 */
export default (error) => {
  const messageTxt = error.response && error.response.data.message ? error.response.data.message : error.message;
  if (messageTxt === "Not authorized, token failed") {
    logout();
  }
  message.error(messageTxt);
  return message;
};
