import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, username } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      
      set({ token, username, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ token: null, username: null, isAuthenticated: false });
  }
}));
export const useMovieStore = create((set, get) => ({
  movies: [],
  totalMovies: 0,
  currentPage: 1,
  loading: false,
  error: null,

  fetchMovies: async (page = 1, search = '', sort = 'title', limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        sort
      }).toString();
      
      console.log(`Fetching movies with query: ${queryParams}`);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/movies?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Movies response:', response.data);
      
      set({ 
        movies: response.data.movies, 
        totalMovies: response.data.totalMovies,
        currentPage: response.data.currentPage,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch movies', 
        loading: false 
      });
      return { movies: [], totalMovies: 0 };
    }
  },

  addMovie: async (movieData) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/movies`, movieData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await get().fetchMovies(get().currentPage);
      
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add movie', 
        loading: false 
      });
      throw error;
    }
  },


  updateMovie: async (id, movieData) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/movies/${id}`, movieData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      set(state => ({
        movies: state.movies.map(movie => 
          movie.id === id ? { ...movie, ...movieData } : movie
        ),
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update movie', 
        loading: false 
      });
      throw error;
    }
  },


  deleteMovie: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      set(state => {
        const newMovies = state.movies.filter(movie => movie.id !== id);
        let newPage = state.currentPage;
        if (newMovies.length === 0 && state.currentPage > 1) {
          newPage = state.currentPage - 1;
          get().fetchMovies(newPage);
        }
        
        return {
          movies: newMovies,
          totalMovies: state.totalMovies - 1,
          currentPage: newPage,
          loading: false
        };
      });
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete movie', 
        loading: false 
      });
      throw error;
    }
  }
}));