import { RiHome2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsBox, BsBroadcastPin } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoCodeSlashOutline } from "react-icons/io5";

export const navigation = (options?: any) => {
  return {
    home: {
      title: "Home",
      links: {
        home: {
          title: "Home",
          link: "/",
          icon: <RiHome2Fill />,
        },
        notifications: {
          title: "Notifications",
          link: "/notifications",
          icon: <FaRegBell />,
        },
      },
      hidden: options?.user ? false : true,
    },
    ministries: {
      title: "Ministry Details",
      links: {
        ministries: {
          title: "Ministries",
          link: "/ministries",
          icon: <BsBox />,
        },
        events: {
          title: "Events",
          link: "/events",
          icon: <BsBroadcastPin />,
        },
      },
      hidden: options?.user ? false : true,
    },
    members: {
      title: "Members",
      links: {
        members: {
          title: "Members",
          link: "/members",
          icon: <BsFillPeopleFill />,
        },
        families: {
          title: "Families",
          link: "/families",
          icon: <BsFillPeopleFill />,
        },
      },
      hidden: options?.user ? false : true,
    },
    account_details: {
      title: "Account Details",
      links: {
        account_details: {
          title: "Edit Account Settings",
          link: "/account_details",
          icon: <CgProfile />,
        },
        keys: {
          title: "API Keys",
          link: "/account_details/keys",
          icon: <IoCodeSlashOutline />,
        },
        support: {
          title: "Support",
          link: "/account_details/support",
          icon: <MdSupportAgent />,
        },
      },
      hidden: options?.user ? false : true,
    },
    auth: {
      title: "Auth",
      links: {
        login: {
          title: "Login",
          link: "/auth/login",
          icon: <CgProfile />,
          hidden: false,
        },
        register: {
          title: "Register",
          link: "/auth/register",
          icon: <CgProfile />,
        },
        forgot_password: {
          title: "Forgot Password",
          link: "/auth/forgotpassword",
          icon: <CgProfile />,
        },
        reset_password: {
          title: "Reset Password",
          link: "/auth/resetpassword",
          icon: <CgProfile />,
        },
      },
      hidden: options?.user ? true : false,
    },
  };
};
