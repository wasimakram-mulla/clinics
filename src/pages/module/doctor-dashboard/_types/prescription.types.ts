export interface Timing {
  M: number;
  A: number;
  N: number;
}
export interface FormData {
  // Define the type for your form data
  medicine: string;
  qty: string;
  timing: Timing;
  duration: string;
  days: string;
  BMAM: string;
}

export type PresciptionDataType = {
  prescription: FormData[];
  followUpDate: string;
  remarks: string;
};
