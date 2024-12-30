import moment from "moment";

export function formatDateWithNextDayOption(
  date: string,
  isArrivalOnNextDay: boolean
) {
  let formattedDate = moment(date, "YYYY-MM-DD");

  if (isArrivalOnNextDay) {
    formattedDate = formattedDate.add(1, "days");
  }

  return formattedDate.format("ddd, DD MMM");
}

export const calculateFlightTime = (tripTime: number) => {
  return `${Math.floor(tripTime / 60)}h ${tripTime % 60}m `;
};
