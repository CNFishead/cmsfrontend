// CalendarView.tsx
import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import CustomDay from "./CustomDay.component";
import dayjs from "dayjs";

interface CalendarViewProps {
  events: any[];
  onEventSelect: (event: any) => void;
  onDateRangeChange: (range: any) => void;
  eventPropGetter: (event: any) => any;
  setDateRanges: (range: any) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventSelect,
  onDateRangeChange,
  eventPropGetter,
  setDateRanges,
}) => {
  const localizer = dayjsLocalizer(dayjs);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  return (
    <Calendar
      localizer={localizer}
      events={events?.map((event: any) => ({
        ...event,
        id: event._id,
        title: event.name,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }))}
      date={currentDate} // Explicitly controlled
      view={view as any} // Explicitly controlled
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      onSelectEvent={onEventSelect}
      components={{
        dateCellWrapper: (props) => <CustomDay {...props} className="customDayCell" />,
      }}
      onNavigate={(date) => {
        setCurrentDate(date); // Updates the current date in state
        setDateRanges({
          start: dayjs(date).startOf("month").toDate(),
          end: dayjs(date).endOf("month").toDate(),
        });
      }}
      onRangeChange={onDateRangeChange}
      eventPropGetter={eventPropGetter}
    />
  );
};

export default CalendarView;
