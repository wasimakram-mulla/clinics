import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../_config/firebase.config';

export const provider = new GoogleAuthProvider();

export const loginUser = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      setUserInDB(result.user.email);
    })
    .catch((error) => {
      alert(error.message);
    });
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const checkIfUserAvailableInDB = async (email: string | null) => {
  const q = query(collection(db, `users`), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());
};

export const setUserInDB = async (email: string | null) => {
  if (email) {
    const isAvail = await checkIfUserAvailableInDB(email);

    if (!isAvail?.length) {
      const userObj = {
        email,
        id: `P-${new Date().getTime()}`,
      };
      sessionStorage.setItem('user', JSON.stringify(userObj));
      await setDoc(doc(db, `users`, email), userObj);
    } else {
      sessionStorage.setItem('user', JSON.stringify(isAvail?.[0]));
    }
  }
};

export const fetchUserRole = async (email: string | null) => {
  if (!email) return;

  const q = query(collection(db, `roles`), where('user', '==', email));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.id)?.[0] || null;
};
