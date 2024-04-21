// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateAge = (dobval: any) => {
  const birthDate = new Date(dobval);
  const currentDate = new Date();
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  // If the current month is before the birth month or it's the birth month but the day is before the birth day
  if (
    months < 0 ||
    (months === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    years--;
    months = 12 - birthDate.getMonth() + currentDate.getMonth();
  }
  // Adjust days for negative values
  if (days < 0) {
    months--;
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    days += previousMonthDate.getDate();
  }

  return {
    years,
    months,
    days,
  };
};
