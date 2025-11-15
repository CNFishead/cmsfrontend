import React, { useMemo } from "react";
import styles from "./MemberDetails.module.scss";
import { PiHandsPrayingFill } from "react-icons/pi";
import { Tabs } from "antd";
import tabs from "./tabs";
import { ControlNavItem } from "@/types/navigation";
import FamilyContainer from "./subviews/controlNav/FamilyContainer.component";
import { FaUserCog, FaUsers } from "react-icons/fa";
import MemberSettings from "./subviews/controlNav/MemberSettings.component";
import { useSetControlNav } from "@/providers/ControlNavProvider";

const MemberDetails = () => {
  // Set up control navigation with user data - memoized to prevent infinite loops
  const controlNav = useMemo<ControlNavItem[] | null>(() => {
    return [
      {
        children: <FamilyContainer />,
        icon: <FaUsers />,
        title: "Member Family Information",
      },
      {
        children: <FamilyContainer />,
        icon: <PiHandsPrayingFill />,
        title: "Family Prayer Requests",
        disabled: true,
        hideIf: true,
      },
      {
        children: <MemberSettings />,
        icon: <FaUserCog />,
        title: "Member Settings",
      },
    ];
  }, []);

  useSetControlNav(controlNav);

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" items={tabs} animated type="card" />
    </div>
  );
};

export default MemberDetails;
