import { Typography } from '@mui/material';

type DisplayAgeProps = {
  Age: AgeProps;
};
type AgeProps = {
  years: number;
  months: number;
  days: number;
};

const DisplayAge: React.FC<DisplayAgeProps> = ({ Age }) => {
  const { years, months, days } = Age;
  return (
    <>
      {years ? (
        <Typography component="strong" color="primary" mr={2}>
          Years: <strong>{years}</strong>
        </Typography>
      ) : (
        ''
      )}
      {months ? (
        <Typography component="strong" color="primary" mr={2}>
          Months: <strong>{months}</strong>
        </Typography>
      ) : (
        ''
      )}
      {days ? (
        <Typography component="strong" color="primary">
          Days: <strong>{days}</strong>
        </Typography>
      ) : (
        ''
      )}
    </>
  );
};

export default DisplayAge;
