import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <Box className="spinnerWrapper">
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
