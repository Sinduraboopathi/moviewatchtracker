import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MovieList from './components/MovieList';  
import MovieTable from './components/MovieTable'; 
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { useAuthStore } from './store';

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <MovieList />
            </PrivateRoute>
          }
        />

        <Route
          path="/movie-table"
          element={
            <PrivateRoute>
              <MovieTable />
            </PrivateRoute>
          }
        />

        
        <Route path="/" element={<Navigate to="/movies" />} />
      </Routes>
    </div>
  );
}

export default App;
