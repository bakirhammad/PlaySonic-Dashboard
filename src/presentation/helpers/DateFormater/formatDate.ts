import moment from "moment";

export const formatToUtc = (
  date: string | Date | undefined,
  format?: "HH:mm" | "YYYY-MM-DD HH:mm"
) => {
  let utcTime;
  if (format) {
    utcTime = moment(date, format).utc().format(format);
  } else {
    utcTime = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  return utcTime;
};

export const formatFromUtcToLocale = (
  date: Date | string | undefined,
  format?: "HH:mm" | "YYYY-MM-DD" | "YYYY-MM-DD HH:mm" | "HH:mm A" | string
) => {
  if (!date) return null;
  const OriginalFormat = format ?? "YYYY-MM-DD";
  return moment.utc(date, OriginalFormat).local().format(OriginalFormat);
};
