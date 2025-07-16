import { Attendance } from '@prisma/client';
import moment from 'moment';

export const countFridaysBetween = (
  startDateStr: string,
  endDateStr: string
): number => {
  const startDate: Date = new Date(startDateStr);
  const endDate: Date = new Date(endDateStr);
  let fridayCount = 0;

  // Normalize both dates to midnight
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const currentDate: Date = new Date(startDate);

  while (currentDate <= endDate) {
    if (currentDate.getDay() === 5) {
      // 5 = Friday
      fridayCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return fridayCount;
};

export const countDaysBetween = (
  startDateStr: string,
  endDateStr: string,
  day: string // e.g., "Friday"
): number => {
  const startDate = moment(startDateStr).startOf('day');
  const endDate = moment(endDateStr).startOf('day');
  let dayCount = 0;

  const currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    if (currentDate.format('dddd').toLowerCase() === day.toLowerCase()) {
      dayCount++;
    }
    currentDate.add(1, 'day');
  }

  return dayCount;
};

export const countTotalDaysBetween = (
  startDateStr: string,
  endDateStr: string
): number => {
  const startDate: Date = new Date(startDateStr);
  const endDate: Date = new Date(endDateStr);

  // Normalize to midnight to avoid timezone issues
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const msInOneDay = 1000 * 60 * 60 * 24;

  const diffInMs = endDate.getTime() - startDate.getTime();

  // Add 1 to include both start and end dates in the count
  return Math.floor(diffInMs / msInOneDay) + 1;
};

export const countLate = (attendances: Attendance[]): number => {
  let count = 0;

  for (let index = 0; index < attendances?.length; index++) {
    const element = attendances[index];

    if (element?.inTime) {
      if (parseInt(moment(element.inTime).format('HHmm')) > 1030) {
        count = count + 1;
      }
    } else {
      count = count + 1;
    }
  }

  // Add 1 to include both start and end dates in the count
  return count;
};
