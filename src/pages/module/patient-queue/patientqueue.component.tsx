import {
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { subscribeUserQueue } from '../../../firebase/_utils/appointment.util';
import { ROUTES } from '../../../routes/routes';
import Header from '../header/header.component';
import { convertMinutesToHours } from './_utils/convertMinutesToHours.util';

const PatientQueue = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const config = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [totalPatientsLeft, setTotalPatientsLeft] = useState<number>(-1);
  const [patientsData, setPatientsData] = useState<DocumentData | null>();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeUserQueue(state?.userId, (patients) => {
      console.log('DATA =>', patients);
      if (patients?.patientsAhead === -1) {
        localStorage.clear();
        navigate(ROUTES.BOOKAPPOINTMENT);
      } else {
        const minsleft = patients.patientsAhead * config;
        setPatientsData(patients?.userData);
        setTotalPatientsLeft(patients.patientsAhead);
        setTimeLeft(minsleft ? convertMinutesToHours(minsleft) : null);
      }
    });

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, config]);

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h6" component="div" color="primary" mb={1}>
          Booked Appointment <u>{dayjs().format('DD MMMM YYYY')}</u>
        </Typography>

        {patientsData ? (
          <>
            <Card sx={{ mt: 4 }}>
              <CardContent
                sx={{
                  paddingBottom: 'inherit !important',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" component="div" color="error" mb={1}>
                  TOKEN NO: {patientsData.tokenNo}
                </Typography>
              </CardContent>
            </Card>
            <Divider sx={{ mt: 2 }} />
          </>
        ) : (
          <></>
        )}

        <Card>
          <CardContent
            sx={{
              paddingBottom: 'inherit !important',
              textAlign: 'center',
            }}
          >
            {timeLeft && totalPatientsLeft ? (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                  mb={1}
                >
                  {totalPatientsLeft} Patients Before you !
                </Typography>
                <Typography
                  sx={{ mb: 1.5 }}
                  variant="h6"
                  color="text.secondary"
                >
                  {timeLeft} Left !
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                  mb={1}
                >
                  Hurry Up, Its your turn !
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PatientQueue;
