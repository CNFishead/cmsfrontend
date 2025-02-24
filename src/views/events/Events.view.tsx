"use client";
import React from "react";
import styles from "./Events.module.scss";
import { Button, Tabs, TabsProps } from "antd";
import Calendar from "./subviews/calendar/Calendar.component";
import { useRouter } from "next/navigation";
import CalendarTable from "./subviews/calendarTable/CalendarTable.component";

const Events = () => {
  const router = useRouter();
  const tabs: TabsProps["items"] = [
    {
      label: "Calendar",
      key: "1",
      children: <Calendar />,
    },
    {
      key: "2",
      children: <CalendarTable />,
      label: "Table",
    },
  ];
  return (
    <Tabs
      defaultActiveKey="2"
      type="card"
      items={tabs}
      animated
      // put a button to add a new event on the right side of the tab
      tabBarExtraContent={
        <Button className={styles.addEventButton} type="primary" onClick={() => router.push("/events/create")}>
          Add Event
        </Button>
      }
    />
  );
};

export default Events;
