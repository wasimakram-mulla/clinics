import { East, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchPatientAllMedicalHistory } from '../../../../firebase/_utils/appointment.util';
import { ReturnMedHistory } from '../_types/patient-history.types';
import PatientHistoryDetails from './patient-history-details.component';

type PatientHistoryProps = {
  userId: string | null;
};

const PatientHistory = ({ userId }: PatientHistoryProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [history, setHistory] = useState<ReturnMedHistory[] | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPatientMedicalHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchPatientMedicalHistory = async () => {
    const history = await fetchPatientAllMedicalHistory(userId as string);
    setHistory(history);
  };

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{ backgroundColor: 'aliceblue', p: 2, pt: 0 }}
      >
        <Typography variant="h6" component="div" color="primary" mb={1}>
          Your Medical History
        </Typography>
        {history?.map((data, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{ color: 'darkblue', textAlign: 'center' }}
              >
                {data.date}
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ mx: 2, position: 'relative', top: 5 }}
                >
                  <East />
                </Typography>
                {data?.history?.name}
              </Typography>
            </AccordionSummary>

            <Divider sx={{ mb: 2 }} />
            <AccordionDetails>
              <PatientHistoryDetails data={data} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Typography>
    </>
  );
};

export default PatientHistory;
