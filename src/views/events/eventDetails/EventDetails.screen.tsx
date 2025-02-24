import React from "react";
import styles from "./EventDetails.module.scss";
import { Tabs, TabsProps } from "antd";
import EventInfo from "./subviews/eventInfo/EventInfo.component";

const EventDetails = () => {
  const tabs: TabsProps["items"] = [
    {
      label: "Event Info",
      key: "1",
      children: <EventInfo />,
    },
    {
      key: "2",
      children: <></>,
      label: "Members",
    },
  ];
  return <Tabs defaultActiveKey="1" type="card" items={tabs} animated />;
};

export default EventDetails;
