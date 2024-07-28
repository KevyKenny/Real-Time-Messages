import dayjs from "dayjs";

export const registeredOn = (registerdDate: string) => {
  const date =
    dayjs(registerdDate).format("MMM D") +
    ", " +
    dayjs(registerdDate).format("h:mm A");
  return date;
};

export const chipColor = (status: string) => {
  if (status === "graduate") {
    return "dark";
  } else {
    return "danger";
  }
};

