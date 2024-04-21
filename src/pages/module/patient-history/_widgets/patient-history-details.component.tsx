import { Divider, Typography } from '@mui/material';
import { FormData } from '../../doctor-dashboard/_types/prescription.types';
import { ReturnMedHistory } from '../_types/patient-history.types';

type PatientHistoryDetailsProps = {
  data: ReturnMedHistory;
};

const PatientHistoryDetails = ({ data }: PatientHistoryDetailsProps) => {
  return (
    <>
      <Typography variant="body1" component="span">
        Name: {data?.history?.name}
      </Typography>
      <Typography variant="body1" component="span" sx={{ float: 'right' }}>
        Mobile: {data?.history?.mobile}
      </Typography>

      <Typography variant="body1" component="div" sx={{ py: 1 }}>
        Symptoms: {data?.history?.symptoms}
      </Typography>

      {data?.history?.height && (
        <Typography variant="body1" component="span">
          Height: {data?.history?.height}
        </Typography>
      )}
      {data?.history?.weight && (
        <Typography variant="body1" component="span" sx={{ float: 'right' }}>
          Width: {data?.history?.weight}
        </Typography>
      )}
      {data?.history?.presciptionData?.prescription?.[0] && (
        <>
          <Divider />
          <Typography variant="body1" component="div" sx={{ pt: 1 }}>
            <strong>
              <u>Prescription</u>
            </strong>
          </Typography>
        </>
      )}
      {data?.history?.presciptionData?.prescription?.map(
        (meds: FormData, medindex: number) => (
          <Typography
            variant="h6"
            component="div"
            key={medindex}
            sx={{ py: 1 }}
          >
            <Typography variant="body1" component="span">
              Medicine: {meds?.medicine}
            </Typography>
            <Typography
              variant="body1"
              component="span"
              sx={{ float: 'right' }}
            >
              Duration: {meds?.duration} {meds?.days} (
              {meds?.BMAM === 'AM' ? 'After Meals' : 'Before Meals'})
            </Typography>

            <Typography variant="body1" component="div">
              Quantity: {meds?.qty} ({meds?.timing.M} - {meds?.timing.A} -{' '}
              {meds?.timing.N})
            </Typography>
          </Typography>
        )
      )}
      <Divider />
      {data?.history?.presciptionData?.remarks && (
        <Typography variant="body1" component="div" sx={{ pt: 1 }}>
          Remarks: {data?.history?.presciptionData?.remarks}
        </Typography>
      )}
      {data?.history?.presciptionData?.followUpDate && (
        <Typography variant="body1" component="div" sx={{ pt: 1 }}>
          Follow Up Date: {data?.history?.presciptionData?.followUpDate}
        </Typography>
      )}
    </>
  );
};

export default PatientHistoryDetails;
