// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/signup', {
//         username: username.trim(),
//         email: email.trim(),
//         password: password.trim(),
//       });

//       setSuccess(response.data.message);
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>Register</h2>
//       {error && <div className="error">{error}</div>}
//       {success && <div className="success">{success}</div>}
      
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           {password.length > 0 && password.length < 6 && (
//             <small className="error">Password must be at least 6 characters long.</small>
//           )}
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>

//       <p>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Regex patterns
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validating username
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-15 characters long and can contain letters, numbers, and underscores.');
      return;
    }

    // Validating email
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validating password
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 6 characters long, include 1 uppercase, 1 lowercase, and 1 number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!usernameRegex.test(username) && username.length > 0 && (
            <small className="error">Username must be 3-15 characters.</small>
          )}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!emailRegex.test(email) && email.length > 0 && (
            <small className="error">Please enter a valid email address.</small>
          )}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!passwordRegex.test(password) && password.length > 0 && (
            <small className="error">Password must be at least 6 chtrs, include 1 uppercase, 1 lowercase, and 1 number.</small>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
