import React from 'react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import MovieTable from './MovieTable';

function Home() {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Movie Watchlist</h1>
      <div>
        <span>Welcome, {username}!</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <MovieTable />
    </div>
  );
}

export default Home;
