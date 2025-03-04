// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useMovieStore, useAuthStore } from '../store';
// import MovieForm from './MovieForm';

// function MovieList() {
//   const [showForm, setShowForm] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('title');
//   const { movies, totalMovies, currentPage, fetchMovies, deleteMovie } = useMovieStore();
//   const { username, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const ITEMS_PER_PAGE = 10;

//   useEffect(() => {
//     fetchMovies(1, '', 'title', ITEMS_PER_PAGE);
//   }, []);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => clearTimeout(timerId);
//   }, [searchTerm]);

//   useEffect(() => {
//     fetchMovies(1, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
//   }, [debouncedSearchTerm, sortBy]);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handlePageChange = (page) => {
//     fetchMovies(page, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
//   };

//   const handleDeleteMovie = (id) => {
//     if (window.confirm('Are you sure you want to delete this movie?')) {
//       deleteMovie(id).then(() => {
//         fetchMovies(currentPage, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
//       });
//     }
//   };

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
//       <h1>Movie Watchlist</h1>
//       <div>
//         <span>Welcome, {username}!</span>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       <button onClick={() => setShowForm(true)}>+ Add Movie</button>
//       <input type="text" placeholder="Search movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//         <option value="title">Sort by Title</option>
//         <option value="release_year">Sort by Year</option>
//         <option value="rating">Sort by Rating</option>
//       </select>

//       <table border="1" width="100%">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Genre</th>
//             <th>Release Year</th>
//             <th>Rating</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {movies.length > 0 ? (
//             movies.map((movie) => (
//               <tr key={movie.id}>
//                 <td>{movie.title}</td>
//                 <td>{movie.genre}</td>
//                 <td>{movie.release_year}</td>
//                 <td>{movie.rating} ★</td>
//                 <td>{movie.status}</td>
//                 <td>
//                   <button onClick={() => {
//                     setSelectedMovie(movie);
//                     setShowForm(true);
//                   }}>Edit</button>
//                   <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" style={{ textAlign: 'center' }}>
//                 {debouncedSearchTerm ? 'No movies found matching your search.' : 'Your watchlist is empty. Add some movies!'}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {totalMovies > 0 && (
//         <div>
//           <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
//             Prev
//           </button>
//           <span> Page {currentPage} of {Math.ceil(totalMovies / ITEMS_PER_PAGE)} </span>
//           <button onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(totalMovies / ITEMS_PER_PAGE)))} disabled={currentPage === Math.ceil(totalMovies / ITEMS_PER_PAGE)}>
//             Next
//           </button>
//         </div>
//       )}

//       {showForm && (
//         <div>
//           <button onClick={() => { setShowForm(false); setSelectedMovie(null); }}>Close</button>
//           <MovieForm
//             movie={selectedMovie}
//             onClose={(wasModified) => {
//               setShowForm(false);
//               setSelectedMovie(null);
//               if (wasModified) {
//                 fetchMovies(currentPage, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
//               }
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default MovieTable;


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
