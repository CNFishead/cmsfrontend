import React from "react";
import styles from "./MinistryDetails.module.scss";
import { Tabs, TabsProps } from "antd";
import Members from "./subviews/Members.component";
import MinistryInfo from "./subviews/MinistryInfo.component";
const MinistryDetails = () => {
  const tabs: TabsProps["items"] = [
    {
      label: "Info",
      key: "1",
      children: <MinistryInfo />,
    },
    {
      key: "2",
      children: <Members />,
      label: "Members",
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default MinistryDetails;
