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
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ token: null, username: null, isAuthenticated: false });
  },
}));

export const useMovieStore = create((set, get) => ({
  movies: [],
  totalMovies: 0,
  offset: 0,
  loading: false,
  error: null,

  fetchMovies: async (offset = 0, search = '', sort = 'title', limit = 10) => {
    try {
      set({ loading: true, error: null });

      const queryParams = new URLSearchParams({
        offset,
        limit,
        ...(search && { search }),
        sort,
      }).toString();

      console.log(`Fetching movies with query: ${queryParams}`);

      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/movies?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Movies response:', response.data);

      set((state) => ({
        movies: offset === 0 ? response.data.movies : [...state.movies, ...response.data.movies],
        totalMovies: response.data.totalMovies,
        offset: offset + response.data.movies.length,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch movies',
        loading: false,
      });
      return { movies: [], totalMovies: 0 };
    }
  },

  fetchTableMovies: async (offset = 0, search = '', sortBy = 'title_asc', limit = 10) => {
    try {
      set({ loading: true, error: null });

      const queryParams = new URLSearchParams({
        offset,
        limit,
        ...(search && { search }),
        sortBy,
      }).toString();

      console.log(`Fetching table movies with query: ${queryParams}`);

      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/movies/table?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Table Movies response:', response.data);

      set({
        movies: response.data.movies,
        totalMovies: response.data.totalMovies,
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching table movies:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch table movies',
        loading: false,
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
          Authorization: `Bearer ${token}`,
        },
      });

      await get().fetchMovies(0, get().search, get().sort, 10);

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add movie',
        loading: false,
      });
      throw error;
    }
  },

  updateMovie: async (id, movieData) => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/movies/${id}`, movieData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await get().fetchTableMovies((get().page-1) * get().limit, get().searchTerm, `${get().sortField}_${get().sortOrder}`, get().limit);
      set({ loading: false });
      return {success: true};
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update movie',
        loading: false,
      });
      return {success: false, message: error.response?.data?.message || 'Failed to update movie'};
    }
  },

  deleteMovie: async (id) => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await get().fetchTableMovies((get().page-1) * get().limit, get().searchTerm, `${get().sortField}_${get().sortOrder}`, get().limit);
      set({ loading: false });
      return {success: true};
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete movie',
        loading: false,
      });
      return {success: false, message: error.response?.data?.message || 'Failed to delete movie'};
    }
  },
  page: 1,
  limit: 10,
  sortField: 'title',
  sortOrder: 'asc',
  searchTerm: '',
}));