'use client';
import React, { useMemo, useEffect } from "react";
import styles from "./MemberDetails.module.scss";
import { PiHandsPrayingFill } from "react-icons/pi";
import { Tabs } from "antd";
import tabs from "./tabs";
import { ControlNavItem } from "@/types/navigation";
import FamilyContainer from "./subviews/controlNav/FamilyContainer.component";
import { FaUserCog, FaUsers } from "react-icons/fa";
import MemberSettings from "./subviews/controlNav/MemberSettings.component";
import { useControlNav } from "@/providers/ControlNavProvider";

const MemberDetails = () => {
  const { setControlNav } = useControlNav();

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

  useEffect(() => {
    setControlNav(controlNav);

    return () => {
      setControlNav(null);
    };
  }, [controlNav, setControlNav]);

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" items={tabs} animated type="card" />
    </div>
  );
};

export default MemberDetails;
