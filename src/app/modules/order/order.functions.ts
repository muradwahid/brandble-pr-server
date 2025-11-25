import { addDays, addHours, addMonths, startOfDay } from "date-fns";

export const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  let current = startOfDay(start);
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  return days;
};

export const eachMonthOfInterval = (start: Date, end: Date): Date[] => {
  const months: Date[] = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const endDate = new Date(end.getFullYear(), end.getMonth(), 1);
  while (current <= endDate) {
    months.push(new Date(current));
    current = addMonths(current, 1);
  }
  return months;
};

export const eachHourOfInterval = (start: Date, end: Date): Date[] => {
  const hours: Date[] = [];
  let current = new Date(start);
  current.setMinutes(0, 0, 0);
  const endHour = new Date(end);
  endHour.setMinutes(0, 0, 0);
  while (current <= endHour) {
    hours.push(new Date(current));
    current = addHours(current, 1);
  }
  return hours;
};