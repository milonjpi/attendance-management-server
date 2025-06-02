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
