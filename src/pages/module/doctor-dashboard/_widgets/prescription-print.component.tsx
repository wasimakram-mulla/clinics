import { useEffect, useState } from 'react';
import { ReturnMedHistory } from '../../patient-history/_types/patient-history.types';
import { fetchPatientAllMedicalHistory } from '../../../../firebase/_utils/appointment.util';
import { useLocation } from 'react-router-dom';
import PatientHistoryDetails from '../../patient-history/_widgets/patient-history-details.component';
import { Typography } from '@mui/material';

const PrescriptionPrint = () => {
  const [history, setHistory] = useState<ReturnMedHistory | null>(null);
  const [userId, setUserId] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    if (state?.userId) {
      setUserId(state?.userId);
    }
  }, [state]);
  useEffect(() => {
    if (userId) {
      fetchPatientMedicalHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchPatientMedicalHistory = async () => {
    const hist = await fetchPatientAllMedicalHistory(userId as string);

    if (hist?.[0]) {
      setHistory(hist?.[0]);
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      alert(
        "Sorry can't find any details here, please go back save and come back"
      );
    }
  };

  return (
    <>
      {history ? (
        <>
          <PatientHistoryDetails data={history} />
        </>
      ) : (
        ''
      )}
      <Typography
        variant="body2"
        component="div"
        color="secondary"
        className="noprint"
        sx={{ mt: 5 }}
      >
        If can't see entire section in print, please cancel this and print using
        CTRL+P to print again
      </Typography>
    </>
  );
};

export default PrescriptionPrint;
