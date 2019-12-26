export const portfolioDateString = (date: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const newDate = new Date(date * 1000);
  return `${newDate.getUTCDate()} ${monthNames[newDate.getUTCMonth()].slice(
    0,
    3
  )}, ${newDate.getUTCHours()}:${newDate.getUTCMinutes()}`;
};
