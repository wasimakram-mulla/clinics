import { Button, Container, Grid } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/_config/firebase.config';
import { fetchUserRole } from '../../../firebase/_utils/user.util';
import { ROUTES } from '../../../routes/routes';
import { USER_ROLES } from '../../common/system.util';
import Header from '../header/header.component';
import {
  BookOnline,
  ManageHistory,
  Medication,
  PeopleAlt,
  PersonSearch,
  Scoreboard,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>();

  const navigateTo = (route: string, state: string | null = null) => {
    if (!state) navigate(route);
    else navigate(route, { state: { userId: state } });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRole(user?.email);
        setTimeout(() => {
          const patientId = sessionStorage.getItem('user') || null;
          setUser(patientId ? JSON.parse(patientId)?.id : null);
        }, 500);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRole = async (email: string | null) => {
    const role = await fetchUserRole(email);
    if (role) setRole(role);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
        <Grid container spacing={5} sx={{ mt: 5 }}>
          <Grid item xs={12} sm={12} md={4}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigateTo(ROUTES.BOOKAPPOINTMENT)}
              startIcon={<BookOnline />}
            >
              Book Appointment
            </Button>
          </Grid>

          {role &&
          (role === USER_ROLES.RECEPTIONIST ||
            role === USER_ROLES.DOCTOR ||
            role === USER_ROLES.ADMIN) ? (
            <>
              <Grid item xs={12} sm={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigateTo(ROUTES.PATIENTMANAGEMENT)}
                  startIcon={<PeopleAlt />}
                >
                  Patient Management
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {role && (role === USER_ROLES.DOCTOR || role === USER_ROLES.ADMIN) ? (
            <>
              <Grid item xs={12} sm={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigateTo(ROUTES.DOCTORDASHBOARD)}
                  startIcon={<Medication />}
                >
                  Doctor Dashboard
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {role &&
          (role === USER_ROLES.RECEPTIONIST ||
            role === USER_ROLES.DOCTOR ||
            role === USER_ROLES.ADMIN) ? (
            <>
              <Grid item xs={12} sm={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigateTo(ROUTES.TOKENBOARD)}
                  startIcon={<Scoreboard />}
                >
                  Token Board
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {user && !role ? (
            <>
              <Grid item xs={12} sm={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigateTo(ROUTES.PATIENTHISTORY, user)}
                  startIcon={<ManageHistory />}
                >
                  My History
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {!user && (
            <>
              <Grid item xs={12} sm={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigateTo(ROUTES.SEARCH)}
                  startIcon={<PersonSearch />}
                >
                  Forgot My Token
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
