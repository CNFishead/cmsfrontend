// utils.ts
export default (event: any) => {
  const currentDate = new Date();
  const isPastEvent = new Date(event.end) < currentDate;
  let backgroundColor;

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
      break;
  }

  if (isPastEvent) {
    backgroundColor = "gray";
  }

  return {
    style: {
      backgroundColor,
      color: "white",
    },
  };
};
