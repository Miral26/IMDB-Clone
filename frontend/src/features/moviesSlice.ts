import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieApi } from '@/services/api';

export interface Movie {
  _id: string;
  name: string;
  yearOfRelease: number;
  plot: string;
  poster: string;
  producer: {
    _id: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    bio: string;
  };
  actors: Array<{
    _id: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    bio: string;
  }>;
}

export interface CreateMovieData {
  name: string;
  yearOfRelease: number;
  plot: string;
  poster: string;
  producer: string;  // producer ID
  actors: string[];  // actor IDs
}

export interface UpdateMovieData {
  name: string;
  yearOfRelease: number;
  plot: string;
  poster: string;
  producer: string;  // producer ID
  actors: string[];  // actor IDs
}

interface MoviesState {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => {
    const response = await movieApi.getAll();
    return response.data;
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: CreateMovieData) => {
    console.log('movieData', movieData)
    const response = await movieApi.create(movieData);
    return response.data;
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, data }: { id: string; data: UpdateMovieData }) => {
    const response = await movieApi.update(id, data);
    return response.data;
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id: string) => {
    await movieApi.delete(id);
    return id;
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: string) => {
    const response = await movieApi.getById(id);
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      // Create movie
      .addCase(createMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload);
      })
      // Update movie
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(movie => movie._id === action.payload._id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      })
      // Delete movie
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(movie => movie._id !== action.payload);
      })
      // Fetch movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie';
      });
  },
});

export default moviesSlice.reducer; 
export const { clearSelectedMovie } = moviesSlice.actions;
