import { DoneOutlineRounded, Print } from '@mui/icons-material';
import {
  Alert,
  Button,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { DocumentData } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  addMedsToCollection,
  checkOutPatient,
  subscribeToAllAppointments,
  updatePatientAndPrescription,
} from '../../../firebase/_utils/appointment.util';
import { PATIENT } from '../../common/system.util';
import Spinner from '../common/spinner.component';
import Header from '../header/header.component';
import { AppointmentProps } from '../patient-appointment/_types/appointment.types';
import PatientManagement from '../patient-management/patientmanagement.component';
import { FinalSumissionType } from './_types/dashboard.types';
import { PresciptionDataType } from './_types/prescription.types';
import Presciption from './_widgets/prescription.component';
import PatientHistory from '../patient-history/_widgets/patient-history.component';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';

const DoctorDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allAppointments, setAllAppointments] = useState<DocumentData[]>();
  const [inPatient, setInPatient] = useState<
    DocumentData | null | AppointmentProps
  >(null);
  const [mobileNo, setMobileNo] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

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
        setInPatient(isPatientIn);
        setMobileNo(isPatientIn?.mobile || '');
        setSymptoms(isPatientIn?.symptoms || '');
        // setDisableInBtn(true);
      } else {
        // setDisableInBtn(false);
      }
    }
  }, [allAppointments]);

  const handleMobileEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNo(e.target.value);
  };
  const handleSymptomsEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymptoms(e.target.value);
  };

  const handleSave = async (presciption: PresciptionDataType) => {
    // API Call for saving here
    try {
      const finalSubmitData: FinalSumissionType = {
        presciptionData: presciption,
        symptoms,
        mobile: mobileNo,
      };
      await updatePatientAndPrescription(
        finalSubmitData,
        inPatient?.userId || null
      );

      const meds = presciption?.prescription?.map((x) =>
        x?.medicine?.toUpperCase()
      );
      await addMedsToCollection(meds);
      setOpenSnackbar(true);
    } catch (error) {
      console.log(error);
      alert('Something went wrong, please try again later');
    }
  };

  const handleCheckOutPatient = async () => {
    try {
      if (inPatient?.userId) {
        await checkOutPatient(inPatient.userId);
        setInPatient(null);
      }
    } catch (error) {
      console.error(error);
      alert('Cannot check out Patient, please try again later');
    }
  };

  const handlePrint = () => {
    const confirmbox = confirm(
      'Have you saved the prescription?\n\nClick OK if done and CANCEL to go back and save.'
    );

    if (confirmbox) {
      navigate(ROUTES.PRINT, { state: { userId: inPatient?.userId } });
    }
  };

  return (
    <>
      <Header />
      {isLoading && <Spinner />}

      <Typography variant="h6" component="div" sx={{ display: 'flex' }}>
        <Typography
          variant="h6"
          component="div"
          color="primary"
          mb={2}
          sx={{ flexGrow: 1 }}
        >
          Welcome, Today is <u>{dayjs().format('DD MMMM YYYY')}</u>
        </Typography>
        {inPatient ? (
          <Typography variant="h6" component="div">
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ mx: 2 }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<DoneOutlineRounded />}
              onClick={handleCheckOutPatient}
            >
              Finish
            </Button>
          </Typography>
        ) : (
          ''
        )}
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: '300px' }}>
        <Grid
          item
          md={3}
          xl={3}
          sx={{
            display: { sm: 'block', xs: 'none', md: 'block', xl: 'block' },
          }}
        >
          <PatientManagement showHeader={false} />
        </Grid>
        <Grid item md={9} xs={12} sx={{ pr: 2 }}>
          {inPatient ? (
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ flexGrow: 1, mt: 0.5 }}
                  color="primary"
                >
                  Name: <strong>{inPatient.name}</strong>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ flexGrow: 1, mt: 0.5 }}
                  color="primary"
                >
                  DOB: <strong>{inPatient.dob}</strong>
                </Typography>
              </Grid>
              {inPatient.weight && (
                <Grid item md={8} xs={12}>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ flexGrow: 1, mt: 0.5 }}
                    color="primary"
                  >
                    Weight: <strong>{inPatient.weight} Kgs</strong>
                  </Typography>
                </Grid>
              )}
              {inPatient.height && (
                <Grid item md={4} xs={12}>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ flexGrow: 1, mt: 0.5 }}
                    color="primary"
                  >
                    Height: <strong>{inPatient.height} Cms</strong>
                  </Typography>
                </Grid>
              )}

              <Grid item md={8} xs={12}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ flexGrow: 1, mt: 0.5 }}
                  color="primary"
                >
                  <TextField
                    value={symptoms}
                    onChange={handleSymptomsEdit}
                    size="small"
                    label="Symptoms"
                    color="primary"
                    maxRows={3}
                    multiline
                    fullWidth
                  />
                </Typography>
              </Grid>

              <Grid item md={4} xs={12}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ flexGrow: 1, mt: 0.5 }}
                  color="primary"
                >
                  <TextField
                    type="number"
                    value={mobileNo}
                    onChange={handleMobileEdit}
                    size="small"
                    label="Mobile Number"
                    color="primary"
                    fullWidth
                  />
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6" component="div" color="secondary">
              Currently, No Patients are IN...
            </Typography>
          )}

          {inPatient ? (
            <>
              <Divider sx={{ my: 2 }} />
              <Grid item md={12} xs={12}>
                <Presciption
                  handleSave={handleSave}
                  initPrescription={inPatient?.presciptionData}
                />
              </Grid>

              <Grid item md={12} xs={12} mt={2}>
                <PatientHistory userId={inPatient?.userId} />
              </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
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

export default DoctorDashboard;
