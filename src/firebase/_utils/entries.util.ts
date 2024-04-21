import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../_config/firebase.config';
import dayjs from 'dayjs';

export const getNumberOfEntries = async () => {
  const q = query(
    collection(db, `appointments/${dayjs().format('DD-MM-YYYY')}/patients`)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());

  // console.log(querySnapshot.size);
  // return querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, ' => ', doc.data());
  // });

  // const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //   const tmpSessions = [];
  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.id);
  //     tmpSessions.push(doc.data());
  //   });
  //   console.log('tmpSessions', tmpSessions);
  // });
};
