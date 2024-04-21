import { CircularProgress, Typography } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { subscribeToAllAppointments } from '../../../firebase/_utils/appointment.util';
import { PATIENT } from '../../common/system.util';
import { AppointmentProps } from '../patient-appointment/_types/appointment.types';

const TokenBoard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allAppointments, setAllAppointments] = useState<DocumentData[]>();
  const [inPatient, setInPatient] = useState<
    DocumentData | null | AppointmentProps
  >(null);
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToAllAppointments(fetchPatientAppointments);
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPatientAppointments = (appointments: DocumentData[]) => {
    setAllAppointments(appointments);
    setIsLoading(false);
  };

  useEffect(() => {
    if (allAppointments?.[0]) {
      const isPatientIn =
        allAppointments.filter((x) => x.isIn === PATIENT.IN)?.[0] || null;
      console.log(isPatientIn);

      if (isPatientIn) {
        setInPatient(isPatientIn);
      }
    }
  }, [allAppointments]);

  return (
    <>
      {isLoading ? (
        <>
          <Typography
            variant="h2"
            component="h2"
            color="primary"
            sx={{ textAlign: 'center', mt: 5, pt: 5 }}
          >
            <CircularProgress />
          </Typography>
        </>
      ) : (
        <>
          {inPatient ? (
            <>
              <Typography
                variant="h2"
                component="h2"
                color="primary"
                sx={{ textAlign: 'center', mt: 5, pt: 5 }}
              >
                Current Token Number
              </Typography>
              <Typography
                variant="h1"
                component="h1"
                color="secondary"
                sx={{ textAlign: 'center', mt: 5, pt: 5 }}
              >
                {inPatient.tokenNo}
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h2"
                component="h2"
                color="secondary"
                sx={{ textAlign: 'center', mt: 5, pt: 5 }}
              >
                No patients IN right now...
              </Typography>
            </>
          )}
        </>
      )}
    </>
  );
};

export default TokenBoard;
