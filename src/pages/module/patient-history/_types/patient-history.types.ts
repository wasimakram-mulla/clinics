import { DocumentData } from 'firebase/firestore';

export type ReturnMedHistory = {
  date: string;
  history: DocumentData;
};
