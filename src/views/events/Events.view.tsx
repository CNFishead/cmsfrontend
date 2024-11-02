"use client";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.module.css";
import styles from "./Events.module.scss";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import useFetchData from "@/state/useFetchData";
import { useUser } from "@/state/auth";
import usePostData from "@/state/usePostData";
import { Button, FloatButton, Form, Modal } from "antd";
import EventForm from "./forms/eventForm/EventForm.form";
import { FaPlus, FaTrash } from "react-icons/fa";
import useUpdateData from "@/state/useUpdateData";
import dayjs from "dayjs";
import useRemoveData from "@/state/useRemoveData";
import { useFormStore } from "@/state/ui/form";
import CalendarView from "./components/CalendarView.component";

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
  ministry?: any;
  calendarType?: string;
}
const Events = () => {
  const [form] = Form.useForm();
  const { setCurrentForm, currentForm } = useFormStore();
  const [dateRanges, setDateRanges] = React.useState({
    start: moment().startOf("month"),
    end: moment().endOf("month"),
  });
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<View>("month"); // Set initial view
  const [modalVisible, setModalVisible] = React.useState(false);
  const { data: loggedInUser } = useUser();
  const { data } = useFetchData({
    url: "/event",
    key: ["events", `${dateRanges.start}-${dateRanges.end}`],
    enabled: !!loggedInUser?.user?._id,
    filter: `user;${loggedInUser?.user?._id}`,
    // + |startDate;{"$gte":"${moment(dateRanges.start).toISOString()}","$lte":"${moment(
    //   dateRanges.end
    // ).toISOString()}"},
    include: `endDate;{"$gte":"${moment(dateRanges.start).toISOString()}","$lte":"${moment(
      dateRanges.end
    ).toISOString()}"}|startDate;{"$gte":"${moment(dateRanges.start).toISOString()}","$lte":"${moment(
      dateRanges.end
    ).toISOString()}"}`,
  });
  const localizer = momentLocalizer(moment);

  const eventPropGetter = (event: any) => {
    const currentDate = new Date();

    // Graying out past events
    const isPastEvent = new Date(event.end) < currentDate;

    let backgroundColor;

    // Assigning different colors based on the 'calendarType' property
    switch (event.calendarType) {
      case "google":
        backgroundColor = "#e53e30";
        break;
      case "outlook":
        backgroundColor = "#0072C6";
        break;
      case "custom":
        backgroundColor = "lightcoral";
        break;
      default:
        // dont change the color
        break;
    }

    // Overriding the background color if it's a past event
    if (isPastEvent) {
      backgroundColor = "gray";
    }

    return {
      style: {
        backgroundColor,
        // color: "white", // you can customize other styles like font color
      },
    };
  };
  return (
    <div className={styles.container}>
      <Modal
        title={
          // if the form is in edit mode, display the edit title, otherwise display the create title
          currentForm?._id ? "Edit Event" : "Create Event"
        }
        open={modalVisible}
        onCancel={() => {
          setCurrentForm(undefined);
          setModalVisible(!modalVisible);
        }}
        footer={null}
        destroyOnClose
      >
        <EventForm setModalVisible={setModalVisible} />
      </Modal>
      <Calendar
        localizer={localizer}
        events={data?.data?.map((event: any) => ({
          ...event,
          id: event._id,
          title: event.name,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        date={currentDate} // Explicitly controlled
        view={view} // Explicitly controlled
        onRangeChange={(range: any) => {
          console.log("Range Change:", range);
          setDateRanges({ start: range.start, end: range.end });
        }}
        onNavigate={(date) => {
          setCurrentDate(date); // Updates the current date in state
          setDateRanges({
            start: moment(date).startOf(view as any),
            end: moment(date).endOf(view as any),
          });
        }}
        onView={(newView) => setView(newView)}
        onSelectEvent={(event) => {
          setCurrentForm({
            ...event,
            dates: [dayjs(event.start), dayjs(event.end)],
          });
          setModalVisible(true);
        }}
        eventPropGetter={eventPropGetter}
      />
      <FloatButton.Group trigger="click">
        <FloatButton onClick={() => setModalVisible(!modalVisible)} icon={<FaPlus />} tooltip="create new event" />
      </FloatButton.Group>
    </div>
  );
};

export default Events;
