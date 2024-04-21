import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { fetchSystemConfigs } from './firebase/_utils/configs.util';
import { RouterConfig } from './routes/routes.config';

export const AppContext = createContext(0);

const App = () => {
  const [configs, setConfigs] = useState(null);
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const tmpconfigs = await fetchSystemConfigs();
    setConfigs(tmpconfigs?.patienttimer || import.meta.env.VITE_PATIENTTIMER);
  };

  if (configs === null) {
    return null; // Return null while configs are being fetched
  }

  return (
    <>
      <AppContext.Provider value={configs}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={RouterConfig} />
        </LocalizationProvider>
      </AppContext.Provider>
    </>
  );
};

export default App;
