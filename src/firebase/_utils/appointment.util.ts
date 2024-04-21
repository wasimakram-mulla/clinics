import dayjs from 'dayjs';
import {
  DocumentData,
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { APPOINTMENT_STATUS, PATIENT } from '../../pages/common/system.util';
import { FinalSumissionType } from '../../pages/module/doctor-dashboard/_types/dashboard.types';
import {
  AppointmentProps,
  AppointmentUpdateProps,
} from '../../pages/module/patient-appointment/_types/appointment.types';
import { db } from '../_config/firebase.config';

export const addAppointment = async (
  data: AppointmentProps,
  userId: string
) => {
  await setDoc(
    doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
    data
  );
};

export const userQueue = async (userId: string) => {
  if (!userId) return -1;
  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`),
    where('status', '==', APPOINTMENT_STATUS.IN_PROGRESS),
    orderBy('priority', 'asc'),
    orderBy('tokenNo', 'asc')
  );
  const querySnapshot = await getDocs(q);

  // return querySnapshot.docs.map((doc) => doc.data());
  const allFilteredUsers = querySnapshot.docs.map((x) => x.data());

  const userData =
    allFilteredUsers.filter((x) => x.userId === userId)?.[0] || null;

  if (userData) {
    // User Is Valid and Present in the Array

    const patientsAhead = allFilteredUsers.findIndex(
      (x) => x.userId === userId
    );
    return { patientsAhead, userData }; //Exact Number of Patients ahead of the user
  } else {
    return -1;
  }
};

export const fetchAllAppointments = async () => {
  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`),
    where('status', '==', APPOINTMENT_STATUS.IN_PROGRESS),
    orderBy('priority', 'asc'),
    orderBy('tokenNo', 'asc')
  );
  const querySnapshot = await getDocs(q);

  // return querySnapshot.docs.map((doc) => doc.data());
  return querySnapshot.docs.map((x) => x.data());
};

type AppointmentsCallback = (appointments: DocumentData[]) => void;
// Realtime Data
export const subscribeToAllAppointments = (callback: AppointmentsCallback) => {
  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`),
    where('status', '==', APPOINTMENT_STATUS.IN_PROGRESS),
    orderBy('priority', 'asc'),
    orderBy('tokenNo', 'asc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const appointments = querySnapshot.docs.map((doc) => doc.data());
    callback(appointments);
  });

  return unsubscribe;
};

export const subscribeUserQueue = (
  userId: string,
  callback: (data: {
    patientsAhead: number;
    userData: DocumentData | null;
  }) => void
) => {
  if (!userId) return () => {}; // Return an empty function for unsubscribe if userId is not provided

  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`),
    where('status', '==', APPOINTMENT_STATUS.IN_PROGRESS),
    orderBy('priority', 'asc'),
    orderBy('tokenNo', 'asc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const allFilteredUsers = querySnapshot.docs.map((x) => x.data());

    const userData = allFilteredUsers.find((x) => x.userId === userId) || null;

    if (userData) {
      const patientsAhead = allFilteredUsers.findIndex(
        (x) => x.userId === userId
      );
      callback({ patientsAhead, userData });
    } else {
      callback({ patientsAhead: -1, userData: null });
    }
  });

  return unsubscribe;
};

export const updateAppointment = async (
  data: AppointmentUpdateProps,
  userId: string | null
) => {
  if (userId) {
    await updateDoc(
      doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
      data
    );
  }
};

export const cancelAppointment = async (userId: string) => {
  await updateDoc(
    doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
    { status: APPOINTMENT_STATUS.CANCELLED }
  );
};

export const letPatientIn = async (userId: string) => {
  await updateDoc(
    doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
    { isIn: PATIENT.IN }
  );
};

export const updatePatientAndPrescription = async (
  data: FinalSumissionType,
  userId: string | null
) => {
  if (userId) {
    await updateDoc(
      doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
      data
    );
  }
};

export const fetchAllMedicines = async () => {
  const medicationsRef = collection(db, `medications`);
  const q = query(medicationsRef);

  const existingMedications = new Set(); // Local cache to store existing medications
  const querySnapshot = await getDocs(q);
  // Fetch existing medications from Firestore and populate the local cache
  querySnapshot.forEach((doc) => {
    existingMedications.add(doc.data().medication);
  });

  return existingMedications;
};

export const addMedsToCollection = async (medications: string[]) => {
  try {
    const medicationsRef = collection(db, `medications`);
    const existingMedications = await fetchAllMedicines();
    // Loop through the array and add each medication as a document
    for (const medication of medications) {
      // Check if medication already exists in the local cache
      if (!existingMedications.has(medication)) {
        // Medication does not exist, add it
        await addDoc(medicationsRef, { medication });
        console.log(`Medication "${medication}" added successfully!`);
      } else {
        console.log(`Medication "${medication}" already exists, skipping...`);
      }
    }

    console.log('All medications processed!');
  } catch (error) {
    console.error('Error adding medications:', error);
  }
};

export const checkOutPatient = async (userId: string | null) => {
  if (userId) {
    await updateDoc(
      doc(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`, userId),
      { isIn: PATIENT.OUT, status: APPOINTMENT_STATUS.DONE }
    );
  }
};

type ReturnMedHistory = {
  date: string;
  history: DocumentData;
};
export const fetchPatientAllMedicalHistory = async (userId: string) => {
  const patientData = query(
    collectionGroup(db, 'patients'),
    where('userId', '==', userId),
    orderBy('__name__', 'desc')
  );
  const querySnapshot = await getDocs(patientData);
  const tmpArr: ReturnMedHistory[] = [];
  querySnapshot.forEach((doc) => {
    tmpArr.push({
      date: doc.ref.parent.parent?.id ? doc.ref.parent.parent?.id : '',
      history: doc.data(),
    });
  });

  return tmpArr;
};

export const searchPatientToken = async (mobile: string, dob: string) => {
  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`),
    where('status', '==', APPOINTMENT_STATUS.IN_PROGRESS),
    where('mobile', '==', mobile),
    where('dob', '==', dob)
  );
  const querySnapshot = await getDocs(q);

  // return querySnapshot.docs.map((doc) => doc.data());
  const allValidPatients = await querySnapshot.docs.map((x) => x.data());
  return allValidPatients;
};
