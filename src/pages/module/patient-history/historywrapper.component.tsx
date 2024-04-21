import { useLocation } from 'react-router-dom';
import Header from '../header/header.component';
import PatientHistory from './_widgets/patient-history.component';

const HistoryWrapper = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <PatientHistory userId={location?.state?.userId} />
    </>
  );
};

export default HistoryWrapper;
