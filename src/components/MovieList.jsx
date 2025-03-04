import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieStore, useAuthStore } from '../store';
import MovieForm from './MovieForm';

function MovieList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const { movies, totalMovies, currentPage, fetchMovies, deleteMovie } = useMovieStore();
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    console.log("Initial loading of movies");
    fetchMovies(1, '', 'title', ITEMS_PER_PAGE);
  }, []);


  useEffect(() => {
    console.log(`Setting up search debounce for: "${searchTerm}"`);
    const timerId = setTimeout(() => {
      console.log(`Debounce complete, setting search term to: "${searchTerm}"`);
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);


  useEffect(() => {
    console.log(`Search or sort changed - search: "${debouncedSearchTerm}", sort: ${sortBy}`);
    fetchMovies(1, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
  }, [debouncedSearchTerm, sortBy]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageChange = (page) => {
    console.log(`Changing to page ${page}`);
    useMovieStore.setState({ currentPage: page });
    fetchMovies(page, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
  };


  const handleSearch = (e) => {
    const value = e.target.value;
    console.log(`Search input changed to: "${value}"`);
    setSearchTerm(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    console.log(`Sort changed to: ${value}`);
    setSortBy(value);
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id).then(() => {

        fetchMovies(currentPage, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
      });
    }
  };
  const getStatusColor = (status) => {
    if (!status) return '#9e9e9e';

    switch (status.toLowerCase()) {
      case 'watched': return '#4caf50';
      case 'watching': return '#2196f3';
      case 'plan to watch': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar) {
      stars.push('✫');
    }

    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };
  const totalPages = Math.ceil(totalMovies / ITEMS_PER_PAGE) || 1;

  console.log('Render state:', {
    movies: movies.length,
    totalMovies,
    currentPage,
    search: debouncedSearchTerm,
    sort: sortBy
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '12px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>Movie Watchlist</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '16px', fontWeight: 'bold' }}>Welcome, {username}!</span>
          <button onClick={handleLogout} style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>Logout</button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <button onClick={() => setShowForm(true)} style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '5px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          fontSize: '12px',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'auto',
          maxWidth: 'fit-content'
        }}>
          <span style={{ marginRight: '2px', fontSize: '14px' }}>+</span> Add Movie
        </button>



        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                padding: '10px',
                paddingRight: '30px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '220px',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#999'
                }}
              >
                ×
              </button>
            )}
          </div>
          <div>
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="title">Sort by Title</option>
              <option value="release_year">Sort by Year</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>


      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              position: 'relative'
            }}>

              <div style={{
                backgroundColor: getStatusColor(movie.status),
                color: 'white',
                padding: '12px 16px',
                fontWeight: 'bold'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{movie.status}</span>
                  <span>{movie.release_year}</span>
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{movie.title}</h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {movie.genre}
                  </span>
                </div>
                <div style={{
                  color: '#f39c12',
                  fontSize: '20px',
                  marginBottom: '16px',
                  letterSpacing: '2px'
                }}>
                  {renderStars(movie.rating)}
                </div>


                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px'
                }}>
                  <button onClick={() => {
                    setSelectedMovie(movie);
                    setShowForm(true);
                  }} style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1',
                    marginRight: '8px'
                  }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteMovie(movie.id)} style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1',
                    marginLeft: '8px'
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              {debouncedSearchTerm ? 'No movies found matching your search.' : 'Your watchlist is empty. Add some movies!'}
            </p>
          </div>
        )}
      </div>


      {totalMovies > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '24px',
          gap: '12px'
        }}>

          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              width: '70px',
              fontSize: '14px',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            &laquo; Prev
          </button>


          <div style={{ color: '#555', fontWeight: 'bold', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
          </div>


          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              width: '70px',
              fontSize: '14px',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next &raquo;
          </button>
        </div>
      )}


      {totalMovies > 0 && (
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#777', fontSize: '14px' }}>
          Showing {movies.length} of {totalMovies} movie{totalMovies !== 1 ? 's' : ''}
          {debouncedSearchTerm ? ` matching "${debouncedSearchTerm}"` : ''}
        </div>
      )}

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedMovie(null);
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >

            </button>
            <MovieForm
              movie={selectedMovie}
              onClose={(wasModified) => {
                setShowForm(false);
                setSelectedMovie(null);


                if (wasModified) {
                  fetchMovies(currentPage, debouncedSearchTerm, sortBy, ITEMS_PER_PAGE);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieList;
