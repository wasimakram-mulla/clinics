export const convertMinutesToHours = (minutes: number) => {
  if (typeof minutes !== 'number' || minutes < 0) {
    return 'Invalid input';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = '';
  if (hours > 0) {
    result += hours === 1 ? '1 hour' : `${hours} hours`;
  }

  if (remainingMinutes > 0) {
    if (result.length > 0) {
      result += ' and ';
    }
    result +=
      remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
  }

  return result;
};
