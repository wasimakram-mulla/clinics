import { FinalSumissionType } from '../../doctor-dashboard/_types/dashboard.types';

export type AppointmentProps = {
  name: string;
  mobile: string;
  symptoms: string;
  weight: string;
  height: string;
  userId: string;
  dob: string;
  tokenNo: number;
  status: number;
  priority: number;
  isIn: number;
  presciptionData?: FinalSumissionType;
};

export type AppointmentUpdateProps = {
  symptoms: string;
  weight: string;
  height: string;
  priority: number;
};
