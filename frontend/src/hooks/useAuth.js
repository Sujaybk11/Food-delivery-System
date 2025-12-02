import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const { token } = useContext(StoreContext);

  const ensureAuth = () => {
    if (!token) {
      toast.error('Please login first');
      return false;
    }
    return true;
  };

  return {
    token,
    ensureAuth,
    isAuthenticated: !!token
  };
};