import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { producerApi } from '@/services/api';

export interface Producer {
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

interface ProducersState {
  producers: Producer[];
  loading: boolean;
  error: string | null;
}

const initialState: ProducersState = {
  producers: [],
  loading: false,
  error: null,
};

export const fetchProducers = createAsyncThunk(
  'producers/fetchProducers',
  async () => {
    const response = await producerApi.getAll();
    return response.data;
  }
);

export const createProducer = createAsyncThunk(
  'producers/createProducer',
  async (producerData: Omit<Producer, '_id' | 'movies'>) => {
    const response = await producerApi.create(producerData);
    return response.data;
  }
);

export const updateProducer = createAsyncThunk(
  'producers/updateProducer',
  async ({ id, data }: { id: string; data: Partial<Producer> }) => {
    const response = await producerApi.update(id, data);
    return response.data;
  }
);

export const deleteProducer = createAsyncThunk(
  'producers/deleteProducer',
  async (id: string) => {
    await producerApi.delete(id);
    return id;
  }
);

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch producers
      .addCase(fetchProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.loading = false;
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch producers';
      })
      // Create producer
      .addCase(createProducer.fulfilled, (state, action) => {
        state.producers.push(action.payload);
      })
      // Update producer
      .addCase(updateProducer.fulfilled, (state, action) => {
        const index = state.producers.findIndex(producer => producer._id === action.payload._id);
        if (index !== -1) {
          state.producers[index] = action.payload;
        }
      })
      // Delete producer
      .addCase(deleteProducer.fulfilled, (state, action) => {
        state.producers = state.producers.filter(producer => producer._id !== action.payload);
      });
  },
});

export default producersSlice.reducer; 