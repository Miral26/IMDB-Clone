import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actorApi } from '@/services/api';

export interface Actor {
  _id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  movies: Array<{
    _id: string;
    name: string;
    yearOfRelease: number;
  }>;
}

interface ActorsState {
  actors: Actor[];
  selectedActor: Actor | null;
  loading: boolean;
  error: string | null;
}

const initialState: ActorsState = {
  actors: [],
  selectedActor: null,
  loading: false,
  error: null,
};

export const fetchActors = createAsyncThunk(
  'actors/fetchActors',
  async () => {
    const response = await actorApi.getAll();
    return response.data;
  }
);

export const fetchActorById = createAsyncThunk(
  'actors/fetchActorById',
  async (id: string) => {
    const response = await actorApi.getById(id);
    return response.data;
  }
);

export const createActor = createAsyncThunk(
  'actors/createActor',
  async (actorData: Omit<Actor, '_id' | 'movies'>) => {
    const response = await actorApi.create(actorData);
    return response.data;
  }
);

export const updateActor = createAsyncThunk(
  'actors/updateActor',
  async ({ id, data }: { id: string; data: Partial<Actor> }) => {
    const response = await actorApi.update(id, data);
    return response.data;
  }
);

export const deleteActor = createAsyncThunk(
  'actors/deleteActor',
  async (id: string) => {
    await actorApi.delete(id);
    return id;
  }
);

const actorsSlice = createSlice({
  name: 'actors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch actors
      .addCase(fetchActors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActors.fulfilled, (state, action) => {
        state.loading = false;
        state.actors = action.payload;
      })
      .addCase(fetchActors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch actors';
      })
      // Fetch actor by ID
      .addCase(fetchActorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedActor = action.payload;
      })
      .addCase(fetchActorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch actor';
      })
      // Create actor
      .addCase(createActor.fulfilled, (state, action) => {
        state.actors.push(action.payload);
      })
      // Update actor
      .addCase(updateActor.fulfilled, (state, action) => {
        const index = state.actors.findIndex(actor => actor._id === action.payload._id);
        if (index !== -1) {
          state.actors[index] = action.payload;
        }
        state.selectedActor = action.payload;
      })
      // Delete actor
      .addCase(deleteActor.fulfilled, (state, action) => {
        state.actors = state.actors.filter(actor => actor._id !== action.payload);
        if (state.selectedActor?._id === action.payload) {
          state.selectedActor = null;
        }
      });
  },
});

export default actorsSlice.reducer; 