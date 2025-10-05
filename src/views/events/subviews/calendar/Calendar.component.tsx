"use client";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.scss";
import { Calendar as BigCalendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import useFetchData from "@/state/useFetchData";
import { useUser } from "@/state/auth";
import { useRouter } from "next/navigation";

const Calendar = () => {
  const router = useRouter();
  const [dateRanges, setDateRanges] = React.useState({
    start: moment().startOf("month"),
    end: moment().endOf("month"),
  });
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<View>("month"); // Set initial view
  const { data: loggedInUser } = useUser();
  const { data } = useFetchData({
    url: "/event",
    key: ["events", `${dateRanges.start}-${dateRanges.end}`],
    enabled: !!loggedInUser?._id,
    filter: `user;${loggedInUser?._id}`,
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
      <BigCalendar
        localizer={localizer}
        events={data?.payload?.map((event: any) => ({
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
          router.push(`/events/${event._id}`);
        }}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default Calendar;
