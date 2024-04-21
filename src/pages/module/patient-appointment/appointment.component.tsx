import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addAppointment,
  userQueue,
} from '../../../firebase/_utils/appointment.util';
import { getNumberOfEntries } from '../../../firebase/_utils/entries.util';
import { ROUTES } from '../../../routes/routes';
import {
  APPOINTMENT_STATUS,
  PATIENT,
  PRIORITY,
} from '../../common/system.util';
import useCheckRole from '../common/useCheckRole';
import Header from '../header/header.component';
import { AppointmentProps } from './_types/appointment.types';
import { calculateAge } from './_utils/calculatedob.util';
import { GenerateGuestId } from './_utils/generateId';
import DisplayAge from './_widgets/displayage.component';

const AppointmentForm = {
  name: '',
  mobile: '',
  symptoms: '',
  weight: '',
  height: '',
};

const BookAppointment = () => {
  const [appointmentForm, setAppointmentForm] = useState(AppointmentForm);
  const [dob, setDob] = useState<Dayjs | null>();
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const navigate = useNavigate();
  const isRoleUser = useCheckRole();

  useEffect(() => {
    const userId = localStorage.getItem('patientId');
    if (userId) checkIfAlreadyHaveAppointment(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfAlreadyHaveAppointment = async (userId: string) => {
    const patients = await userQueue(userId);
    if (patients !== -1 && patients?.userData) {
      navigate(ROUTES.APPOINTMENTQUEUE, { state: { userId } });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCalculateAge = (dobval: any) => {
    setDob(dobval);
    const dobdetails = calculateAge(dobval);
    setAge(dobdetails);
  };

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value });
  };

  const handleAppointmentSubmit = async () => {
    const tokenNo = await getNumberOfEntries();
    const sessionVal = sessionStorage.getItem('user');
    const isUser = sessionVal ? JSON.parse(sessionVal) : null;
    const userId = !isRoleUser
      ? GenerateGuestId()
      : isUser?.id || GenerateGuestId();

    const submitFormData: AppointmentProps = {
      ...appointmentForm,
      userId,
      dob: dayjs(dob).format('MM/DD/YYYY'),
      tokenNo: tokenNo.length + 1,
      status: APPOINTMENT_STATUS.IN_PROGRESS,
      priority: PRIORITY.REGULAR,
      isIn: PATIENT.OUT,
    };
    // console.log(submitFormData);
    await addAppointment(submitFormData, userId);

    if (isRoleUser) {
      localStorage.setItem('patientId', userId);
      navigate(ROUTES.APPOINTMENTQUEUE, { state: { userId } });
    } else navigate(ROUTES.DEFAULT);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h6" component="div" color="primary" mb={1}>
          Book an Appointment for <u>{dayjs().format('DD MMMM YYYY')}</u>
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: '100px' }}>
          <Grid item md={6} sm={12} xs={12}>
            <TextField
              id="standard-basic-fname"
              label="Child's Name"
              variant="standard"
              placeholder="Child's Full Name"
              name="name"
              value={appointmentForm.name}
              onChange={handleForm}
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <DatePicker
              label="Date Of Birth"
              closeOnSelect={true}
              value={dob}
              onChange={(newValue) => handleCalculateAge(newValue)}
              slotProps={{
                textField: {
                  helperText: 'DD/MM/YYYY',
                },
              }}
              format="DD/MM/YYYY"
              orientation="portrait"
              disableFuture
              sx={{ width: '100%', marginTop: 1 }}
            />

            <DisplayAge Age={age} />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <TextField
              id="standard-basic-contact"
              type="number"
              label="Mobile Number"
              variant="standard"
              placeholder="Enter Mobile Number"
              name="mobile"
              value={appointmentForm.mobile}
              onChange={handleForm}
              fullWidth
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <TextField
              id="standard-basic-symptoms"
              label="Symptoms (optional)"
              variant="standard"
              placeholder="Enter Symptoms (optional)"
              name="symptoms"
              value={appointmentForm.symptoms}
              onChange={handleForm}
              fullWidth
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <TextField
              id="standard-basic-weight"
              type="number"
              label="Weight in Kgs (optional)"
              variant="standard"
              placeholder="Enter Weight in Kgs (optional)"
              name="weight"
              value={appointmentForm.weight}
              onChange={handleForm}
              fullWidth
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <TextField
              id="standard-basic-height"
              type="number"
              label="Height in cms (optional)"
              variant="standard"
              placeholder="Enter Height in cms (optional)"
              name="height"
              value={appointmentForm.height}
              onChange={handleForm}
              fullWidth
            />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <Button
              onClick={handleAppointmentSubmit}
              variant="contained"
              disabled={
                !appointmentForm.name || !appointmentForm.mobile || !dob
              }
              fullWidth
              sx={{ marginBottom: '100px' }}
            >
              Book Appointment
            </Button>
          </Grid>
          <Grid item md={12} sm={12} xs={12} sx={{ my: 5 }}></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BookAppointment;
