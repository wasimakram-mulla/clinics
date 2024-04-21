import {
  Alert,
  Container,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { DocumentData } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  cancelAppointment,
  subscribeToAllAppointments,
} from '../../../firebase/_utils/appointment.util';
import Spinner from '../common/spinner.component';
import Header from '../header/header.component';
import PatientRow from './_widgets/patientrow.component';
import UpdatePatient from './_widgets/updatepatient.component';
import { PATIENT } from '../../common/system.util';

type PatientManagementProps = {
  showHeader?: boolean;
};

const PatientManagement = ({ showHeader = true }: PatientManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allAppointments, setAllAppointments] = useState<DocumentData[]>();
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selPatient, setSelPatient] = useState<DocumentData | null>();
  const [disableInBtn, setDisableInBtn] = useState(false);

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
      if (isPatientIn) {
        setDisableInBtn(true);
      } else {
        setDisableInBtn(false);
      }
    }
  }, [allAppointments]);
  const handleOpenModal = (data: DocumentData) => {
    setSelPatient(data);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenSnackbar(true);
    setSelPatient(null);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleCancelAppointment = async (data: DocumentData) => {
    const conf = confirm(
      `Are you sure you want to cancel appointment for ${data.name} ?`
    );

    if (conf) {
      await cancelAppointment(data.userId);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      {showHeader ? <Header /> : ''}
      {isLoading && <Spinner />}

      <Container maxWidth="md" disableGutters>
        {showHeader ? (
          <Typography variant="h6" component="div" color="primary" mb={2}>
            All Appointments- <u>{dayjs().format('DD MMMM YYYY')}</u>
          </Typography>
        ) : (
          <></>
        )}
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'thistle' }}>
                <TableCell>
                  <strong>Token</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAppointments?.[0] ? (
                allAppointments.map((data, index) => (
                  <React.Fragment key={index}>
                    <PatientRow
                      data={data}
                      handleOpen={handleOpenModal}
                      handleCancelAppointment={handleCancelAppointment}
                      disableInBtn={disableInBtn}
                      hideButtons={showHeader}
                    />
                  </React.Fragment>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography
                        variant="body1"
                        component="div"
                        color="error"
                        textAlign="center"
                      >
                        No Appointments !!!
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          {selPatient && (
            <UpdatePatient
              selectedPatient={selPatient}
              handleModalClose={handleClose}
            />
          )}
        </div>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Patient details updated!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientManagement;
