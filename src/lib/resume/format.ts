import type { DateRange, MonthYear } from "./schema";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatMonthYear = (date?: MonthYear) =>
  !date
    ? ""
    : date.month
      ? `${MONTHS[date.month - 1]} ${date.year}`
      : String(date.year);

export const formatDateRange = ({ start, end, present }: DateRange) =>
  [formatMonthYear(start), present ? "Present" : formatMonthYear(end)]
    .filter(Boolean)
    .join(" - ");
