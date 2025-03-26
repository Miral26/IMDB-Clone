import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import actorsReducer from './actorsSlice';
import producersReducer from './producersSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    actors: actorsReducer,
    producers: producersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 