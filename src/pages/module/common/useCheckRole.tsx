import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/_config/firebase.config';
import { fetchUserRole } from '../../../firebase/_utils/user.util';

const useCheckRole = () => {
  const [roleUser, setRoleUser] = useState<string | boolean>(false); // Default to true

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRole(user?.email);
      } else {
        setRoleUser(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRole = async (email: string | null) => {
    //Check Role
    const role = await fetchUserRole(email);
    if (role) setRoleUser(false);
    else setRoleUser(true);
  };

  return roleUser; // Expose connected state to components
};

export default useCheckRole;
