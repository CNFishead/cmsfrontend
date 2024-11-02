import React from "react";
import { useSelector } from "react-redux";
import styles from "./Alert.module.scss";
import { Alert as AntAlert } from "antd";

const Alert = () => {
  // App State
  const { alerts } = useSelector((state) => state.alert);
  return (
    <div className={styles.alertWrapper}>
      {alerts.map((alert) => (
        <AntAlert key={alert.id} className={`alert`} type={alert.alertType} description={alert.message} showIcon />
      ))}
    </div>
  );
};

export default Alert;
