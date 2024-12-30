const DaysOfTheWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const userActivityTime = 2 * 60; // in minutes

/**
 * static company id
 *  if change to dynamic don't forget change it everywhere it used
 */
const companyId = 65;

const dataInvalidationTime = 6 * 60 * 1000; // 1 hour

export const Constant = {
  userActivityTime,
  companyId,
  DaysOfTheWeek,
  dataInvalidationTime,
};
