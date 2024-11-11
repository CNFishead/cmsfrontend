"use client";
import React from "react";
import styles from "./Errors.module.scss";
import { useInterfaceStore } from "@/state/interface";
import { Alert } from "antd";

const Errors = () => {
  const { errors } = useInterfaceStore((state) => state);
  return (
    <div className={styles.container}>
      {errors.map((error: any) => (
        <Alert key={error.id} message={error.message} type={error.type} showIcon closable />
      ))}
    </div>
  );
};

export default Errors;
