import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Header from '../header/header.component';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Search } from '@mui/icons-material';
import { searchPatientToken } from '../../../firebase/_utils/appointment.util';
import { DocumentData } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';

const PatientSearch = () => {
  const [dob, setDob] = useState<Dayjs | null>();
  const [mobile, setMobile] = useState<string>('');
  const [patients, setPatients] = useState<DocumentData[] | null>(null);
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCalculateAge = (dobval: any) => {
    setDob(dobval);
  };

  const handleSearch = async () => {
    if (mobile && dob) {
      const patients = await searchPatientToken(
        mobile,
        dayjs(dob).format('MM/DD/YYYY')
      );
      setPatients(patients);
    }
  };

  const handleSelectToken = (data: DocumentData) => {
    localStorage.setItem('patientId', data.userId);
    navigate(ROUTES.APPOINTMENTQUEUE, { state: { userId: data?.userId } });
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h6" component="div" color="primary" mb={1}>
          Search Your Token
        </Typography>

        <Grid container spacing={2}>
          <Grid item md={6} xs={12} sx={{ mt: 2 }}>
            <TextField
              type="number"
              label="Enter Mobile Number"
              placeholder="Enter Mobile Number without (+91 / 0)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 2 }}>
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
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item md={6} xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              fullWidth
              disabled={!mobile || !dob}
            >
              Search
            </Button>
          </Grid>

          {patients?.[0] ? (
            <Grid item md={12} xs={12} sx={{ mt: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => handleSelectToken(data)}
                          >
                            Select Token
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <>
              {patients !== null && (
                <Grid item md={12} xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" component="div" color="error" mb={5}>
                    Sorry unable to find you, please enter correct details and
                    search again.
                  </Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default PatientSearch;
