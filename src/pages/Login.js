import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // adjust path as needed

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get setUser from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/login/login_check.php`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {

        const userRes = await axios.get(
          `${BASE_URL}/login/user_info.php`,
          { withCredentials: true }
        );

        setUser(userRes.data.user);

        navigate('/home');
      } else {
        clearFields();
        setError(response.data.message || 'Username or password is incorrect.');
      }
    } catch (err) {
      clearFields();
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className=".login-container vh-100 d-flex justify-content-center align-items-center">
      <img src="/images/kuhs_bg1.jpg" alt="Background" className="login-background-image" />
      <div className="top-center-logo">
        <img src="/images/kuhs_logo.png" alt="KUHS Logo" width="80" height="80" />
        <br />
        <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
          KERALA UNIVERSITY OF HEALTH SCIENCES
        </span>
      </div>

      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <div className="text-center mb-3">
          <h5 className="mb-0">ASSET REGISTER<br /> LOGIN</h5>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-danger text-center mb-3">{error}</div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
