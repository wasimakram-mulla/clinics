import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/module/home/home.component';
import { ROUTES } from './routes';
import BookAppointment from '../pages/module/patient-appointment/appointment.component';
import PatientQueue from '../pages/module/patient-queue/patientqueue.component';
import PatientManagement from '../pages/module/patient-management/patientmanagement.component';
import DoctorDashboard from '../pages/module/doctor-dashboard/dashboard.component';
import HistoryWrapper from '../pages/module/patient-history/historywrapper.component';
import PrescriptionPrint from '../pages/module/doctor-dashboard/_widgets/prescription-print.component';
import PatientSearch from '../pages/module/patient-search/patient-search.component';
import TokenBoard from '../pages/module/token-board/token-board.component';

export const RouterConfig = createBrowserRouter([
  {
    path: ROUTES.DEFAULT,
    element: <Home />,
  },
  {
    path: ROUTES.BOOKAPPOINTMENT,
    element: <BookAppointment />,
  },
  {
    path: ROUTES.APPOINTMENTQUEUE,
    element: <PatientQueue />,
  },
  {
    path: ROUTES.PATIENTMANAGEMENT,
    element: <PatientManagement />,
  },
  {
    path: ROUTES.DOCTORDASHBOARD,
    element: <DoctorDashboard />,
  },
  {
    path: ROUTES.PATIENTHISTORY,
    element: <HistoryWrapper />,
  },
  {
    path: ROUTES.PRINT,
    element: <PrescriptionPrint />,
  },
  {
    path: ROUTES.SEARCH,
    element: <PatientSearch />,
  },
  {
    path: ROUTES.TOKENBOARD,
    element: <TokenBoard />,
  },
]);
