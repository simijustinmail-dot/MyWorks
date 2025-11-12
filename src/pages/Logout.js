import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.get(`${BASE_URL}/login/logout.php`, { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          localStorage.clear(); // Clear local/session storage if used
          navigate('/');   // Redirect after successful logout
        } else {
          console.warn('Logout was not successful');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
        navigate('/');
      });
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
