import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/_config/firebase.config';
import {
  loginUser,
  logoutUser,
  setUserInDB,
} from '../../../firebase/_utils/user.util';
import { ROUTES } from '../../../routes/routes';

interface HeaderProps {
  isLoggedIn?: (flag: boolean) => void | undefined;
}
const Header = ({ isLoggedIn }: HeaderProps) => {
  const [userDets, setUserDets] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const sessionVal = sessionStorage.getItem('user');
        const isUser = sessionVal ? JSON.parse(sessionVal) : null;
        !isUser && setUserInDB(user.email);
        isLoggedIn && isLoggedIn(true);
        setUserDets(user);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutUserFromHeader = async () => {
    await logoutUser()
      .then(() => {
        sessionStorage.clear();
        localStorage.clear();
        setUserDets(null);
        navigate(ROUTES.DEFAULT);
        window.location.reload();
      })
      .catch((error) => {
        alert('Error: Unable to sign you out');
        console.log(error);
      });
  };

  const handleHomeClick = () => {
    if (location.pathname !== ROUTES.DEFAULT) {
      navigate(ROUTES.DEFAULT);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button onClick={handleHomeClick} sx={{ color: 'white' }}>
                VEERA CLINIC
              </Button>
            </Typography>

            <Typography variant="body1" component="div" sx={{ mr: 2 }}>
              <Link to={ROUTES.DEFAULT} style={{ color: '#fff' }}>
                HOME
              </Link>
            </Typography>

            {!userDets ? (
              <Button color="inherit" onClick={loginUser}>
                Login
              </Button>
            ) : (
              <>
                <IconButton size="small" sx={{ p: 0 }}>
                  <Avatar
                    alt={userDets?.displayName || ''}
                    src={userDets?.photoURL || ''}
                    sx={{ width: 24, height: 24 }}
                    imgProps={{ referrerPolicy: 'no-referrer' }}
                  />
                </IconButton>

                <Button color="inherit" onClick={logoutUserFromHeader}>
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
