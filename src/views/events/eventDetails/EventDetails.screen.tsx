"use client";
import React from "react";
import { Tabs, TabsProps } from "antd";
import EventInfo from "./subviews/eventInfo/EventInfo.component";
import Attendees from "./subviews/attendees/Attendees.component";
import { useParams } from "next/navigation";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";
import dayjs from "dayjs";

const EventDetails = () => {
  const { id } = useParams();
  const { data: userData } = useUser();

  const { data } = useApiHook({
    url: `/event`,
    key: "eventInfo",
    method: "GET",
    enabled: !!id && !!userData?._id,
    filter: `user;${userData?._id}|_id;${id}`,
  }) as any;
  const tabs: TabsProps["items"] = [
    {
      label: "Event Info",
      key: "1",
      children: <EventInfo />,
    },
    {
      key: "2",
      children: <Attendees />,
      label: "People Attending",
      disabled: !id,
    },
    {
      key: "3",
      children: <div>Event Details</div>,
      label: "Event Analysis",
      // disabled if the event has not passed its end date yet
      disabled: !id || dayjs(data?.payload[0]?.endDate).isAfter(dayjs()),
    },
  ];
  return <Tabs defaultActiveKey="1" type="card" items={tabs} animated />;
};

export default EventDetails;
