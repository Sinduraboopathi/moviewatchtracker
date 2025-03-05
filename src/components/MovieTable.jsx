import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieStore, useAuthStore } from '../store';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Autocomplete,
  Rating,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function MovieTable() {
  const { username, logout } = useAuthStore();
  const { movies, totalMovies, fetchTableMovies, deleteMovie, updateMovie } = useMovieStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMovie, setEditMovie] = useState(null);
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    fetchTableMovies((page - 1) * limit, searchTerm, `<span class="math-inline">\{sortField\}\_</span>{sortOrder}`, limit);
  }, [page, searchTerm, sortField, sortOrder, fetchTableMovies, limit]);

  useEffect(() => {
    if (movies && movies.length > 0) {
      const allGenres = movies.map((movie) => movie.genre).filter(Boolean);
      setGenreOptions([...new Set(allGenres)]);
    }
  }, [movies]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id).then(() => {
        fetchTableMovies((page - 1) * limit, searchTerm, `<span class="math-inline">\{sortField\}\_</span>{sortOrder}`, limit);
      });
    }
  };

  const handleEditMovie = (movie) => {
    setEditMovie({
      ...movie,
      release_year: dayjs(movie.release_year.toString()),
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (editMovie) {
        await updateMovie(editMovie.id, {
          ...editMovie,
          release_year: editMovie.release_year.year(),
        });
        setEditMovie(null);
        fetchTableMovies((page - 1) * limit, searchTerm, `<span class="math-inline">\{sortField\}\_</span>{sortOrder}`, limit);
      }
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditMovie(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 200, sortable: true },
    { field: 'genre', headerName: 'Genre', width: 150, sortable: false, renderCell: (params) => editMovie && editMovie.id === params.row.id ? (<Autocomplete options={genreOptions} value={editMovie.genre || ''} onChange={(event, newValue) => setEditMovie({ ...editMovie, genre: newValue })} renderInput={(params) => <TextField {...params} label="Genre" />} />) : (params.value) },
    { field: 'release_year', headerName: 'Release Year', width: 150, sortable: true, renderCell: (params) => editMovie && editMovie.id === params.row.id ? (<LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker value={editMovie.release_year} onChange={(newValue) => setEditMovie({ ...editMovie, release_year: newValue })} renderInput={(params) => <TextField {...params} />} maxDate={dayjs('2025-12-31')} views={['year']} /></LocalizationProvider>) : (params.value) },
    { field: 'rating', headerName: 'Rating', width: 150, sortable: true, renderCell: (params) => editMovie && editMovie.id === params.row.id ? (<Rating value={editMovie.rating} onChange={(event, newValue) => setEditMovie({ ...editMovie, rating: newValue })} />) : (<Rating value={params.value} readOnly />) },
    { field: 'status', headerName: 'Status', width: 150, sortable: false, renderCell: (params) => editMovie && editMovie.id === params.row.id ? (<Select value={editMovie.status || ''} onChange={(event) => setEditMovie({ ...editMovie, status: event.target.value })}><MenuItem value="watched">Watched</MenuItem><MenuItem value="watching">Watching</MenuItem><MenuItem value="plan to watch">Plan to Watch</MenuItem></Select>) : (params.value) },
    { field: 'actions', headerName: 'Actions', width: 150, sortable: false, renderCell: (params) => (<>{editMovie && editMovie.id === params.row.id ? (<><Button size="small" onClick={handleSaveEdit}>Save</Button><Button size="small" onClick={handleCancelEdit}>Cancel</Button></>) : (<><IconButton aria-label="edit" onClick={() => handleEditMovie(params.row)}><Edit /></IconButton><IconButton aria-label="delete" onClick={() => handleDeleteMovie(params.row.id)}><Delete /></IconButton></>)}</>) },
  ];

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
        <Box component="h1" sx={{ margin: 0, color: '#333', fontSize: '28px' }}>Movie Table</Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="span" sx={{ marginRight: '16px', fontWeight: 'bold' }}>Welcome, {username}!</Box>
          <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>

      <TextField label="Search movies..." value={searchTerm} onChange={handleSearch} sx={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '20px', width: '300px' }} />

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={movies}
          columns={columns}
          pageSize={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
          disableSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          onSortModelChange={(model) => {
            if (model && model.length > 0) {
              handleSort(model[0].field);
            } else {
              handleSort('title');
            }
          }}
          sortingMode="server"
          rowCount={totalMovies}
          paginationMode="server"
          page={page - 1}
          onPageChange={(newPage) => setPage(newPage + 1)}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(totalMovies / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default MovieTable;