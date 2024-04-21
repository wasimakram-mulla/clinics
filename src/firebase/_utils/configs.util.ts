import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../_config/firebase.config';

export const fetchSystemConfigs = async () => {
  const q = query(collection(db, `config`));
  const querySnapshot = await getDocs(q);

  //   querySnapshot.forEach((x) => console.log(x.data()));
  return querySnapshot.docs.map((doc) => doc.data())?.[0] || null;
};
