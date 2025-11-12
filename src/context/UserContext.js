import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/login/user_info.php`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    };

    //  Run immediately on mount
    checkSession();

    // Polling every 4 minutes instead of 5
    const interval = setInterval(checkSession, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //  Axios interceptor for catching session expiry
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.error === 'SESSION_EXPIRED') {
          setUser(null); // clear user state
          window.location.href = '/'; // redirect to login
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
