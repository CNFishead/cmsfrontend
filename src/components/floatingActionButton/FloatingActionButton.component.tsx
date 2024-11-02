import React, { ReactComponentElement, ReactNode } from "react";
import styles from "./FloatingActionButton.module.scss";
import { FloatButton, Tooltip } from "antd";

interface FloatingActionButtonProps {
  // buttons will be an array of objects that have a tooltip, color, and action
  buttons: {
    icon: any;
    tooltip: string;
    color: string;
    action: () => void;
  }[];
  icon: any;
}

/**
 * @description - FloatingActionButton component, renders a floating action button
 *                Takes in an action, color, and icon and renders a clickable button
 * @returns {JSX.Element} - FloatingActionButton
 */
const FloatingActionButton = (props: FloatingActionButtonProps) => {
  return (
    <FloatButton.Group className={styles.container} trigger="hover" icon={props.icon}>
      {props.buttons?.map((button) => {
        return (
          <Tooltip title={button.tooltip} key={button.tooltip}>
            <FloatButton onClick={button.action} className={styles.button} shape="circle" icon={button.icon} />
          </Tooltip>
        );
      })}
    </FloatButton.Group>
  );
};

export default FloatingActionButton;
