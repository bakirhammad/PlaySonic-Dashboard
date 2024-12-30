import moment from "moment";

export default function convertTimeToDecimal(time: string) {
  const hours = moment(time, "HH:mm:ss").hours();
  const minutes = moment(time, "HH:mm:ss").minutes();
  return hours + minutes / 60;
}
