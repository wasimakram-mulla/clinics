import { DeleteForever, Edit, NextPlan } from '@mui/icons-material';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { PRIORITY } from '../../../common/system.util';
import { letPatientIn } from '../../../../firebase/_utils/appointment.util';

interface PatientRowProps {
  data: DocumentData;
  handleOpen: (data: DocumentData) => void;
  handleCancelAppointment: (data: DocumentData) => void;
  disableInBtn: boolean;
  hideButtons: boolean;
}

const PatientRow = ({
  data,
  handleOpen,
  handleCancelAppointment,
  disableInBtn,
  hideButtons,
}: PatientRowProps) => {
  const handleLetPatientIn = async () => {
    await letPatientIn(data.userId);
  };

  const applyBgColor = () => {
    if (data?.isIn) {
      return 'aqua';
    } else {
      return data?.priority === PRIORITY.HIGH
        ? 'darkseagreen'
        : data?.priority === PRIORITY.LOW
        ? 'ButtonFace'
        : '';
    }
  };

  return (
    <>
      <TableRow
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          backgroundColor: applyBgColor(),
        }}
      >
        <TableCell sx={{ py: 1 }}>{data.tokenNo}</TableCell>
        <TableCell sx={{ py: 1 }}>{data.name}</TableCell>
        <TableCell sx={{ py: 1 }}>
          {hideButtons ? (
            <>
              <IconButton
                size="small"
                color="error"
                sx={{ mr: 1 }}
                title="Edit Patient"
                onClick={() => handleOpen(data)}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => handleCancelAppointment(data)}
              >
                <DeleteForever />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                sx={{ mr: 1 }}
                onClick={handleLetPatientIn}
                disabled={disableInBtn}
              >
                <NextPlan />
              </IconButton>
            </>
          ) : (
            ''
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default PatientRow;
