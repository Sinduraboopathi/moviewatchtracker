import React, { useState } from 'react';
import { useMovieStore } from '../store';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Autocomplete } from "@mui/material";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';

const genres = [
  "Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller", "Sci-Fi", "Animation"
];

const labels = {
  1: 'Useless', 2: 'Poor',
  3: 'Ok', 4: 'Good', 5: 'Excellent'
};


function MovieForm({ movie, onClose }) {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    genre: movie?.genre || "",
    release_year: movie?.release_year ? dayjs(movie.release_year) : null,

    rating: movie?.rating || 0,
    status: movie?.status || "",
  });

  const [hover, setHover] = useState(-1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleYearChange = (newValue) => {
    setFormData({ ...formData, release_year: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (movie?.id) {
        await useMovieStore.getState().updateMovie(movie.id, { ...formData, release_year: formData.release_year?.year() });
      } else {
        await useMovieStore.getState().addMovie({ ...formData, release_year: formData.release_year?.year() });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save movie:', error);
    }
  };

  return (
    <div>
      <h2>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <TextField
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Genre:</label>
          <Autocomplete
            freeSolo
            options={genres}
            value={formData.genre}
            onChange={(_, newValue) => setFormData({ ...formData, genre: newValue || "" })}
            renderInput={(params) => <TextField {...params} label="" fullWidth required />}
          />
        </div>


        <div className="form-group">
          <label>Release Year:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year']}
              value={formData.release_year}
              onChange={handleYearChange}
              disableFuture
              maxDate={dayjs('2025-12-31')}
            />
          </LocalizationProvider>

        </div>

        <div className="form-group">
          <label>Rating:</label>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              name="rating"
              value={formData.rating}
              precision={1}
              onChange={(event, newValue) => setFormData({ ...formData, rating: newValue })}
              onChangeActive={(_, newHover) => setHover(newHover)}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {formData.rating !== null && (
              <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : formData.rating]}</Box>
            )}
          </Box>
        </div>

        {/* <div className="form-group">
  <label>Rating:</label>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Rating
      name="rating"
      value={formData.rating}
      precision={0.5}
      onChange={(event, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
      onChangeActive={(_, newHover) => setHover(newHover)}
      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      disabled={formData.status !== "Watched"} 
    />
    {formData.rating !== null && (
      <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : formData.rating]}</Box>
    )}
  </Box>
</div> */}


        <div className="form-group">

          <FormControl fullWidth>
            <InputLabel></InputLabel>
            <label>Status:</label>
            <Select name="status" value={formData.status} onChange={handleChange} required>
              <MenuItem value="Watched">Watched</MenuItem>
              <MenuItem value="Watching">Watching</MenuItem>
              <MenuItem value="Plan to Watch">Plan to Watch</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{movie ? 'Update' : 'Add'} Movie</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default MovieForm;
