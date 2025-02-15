import React from "react";
import styles from "./MemberDetails.module.scss";
import { Tabs } from "antd";
import tabs from "./tabs";

const MemberDetails = () => {
  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" items={tabs} animated type="card"/>
    </div>
  );
};

export default MemberDetails;
