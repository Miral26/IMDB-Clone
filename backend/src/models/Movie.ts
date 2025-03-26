import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  name: string;
  yearOfRelease: number;
  plot: string;
  poster: string;
  producer: mongoose.Types.ObjectId;
  actors: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  yearOfRelease: {
    type: Number,
    required: [true, 'Year of release is required'],
    min: [1888, 'First movie was released in 1888'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  plot: {
    type: String,
    required: [true, 'Plot is required']
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required']
  },
  producer: {
    type: Schema.Types.ObjectId,
    ref: 'Producer',
    required: [true, 'Producer is required']
  },
  actors: [{
    type: Schema.Types.ObjectId,
    ref: 'Actor',
    required: [true, 'At least one actor is required']
  }]
}, {
  timestamps: true
});

export default mongoose.model<IMovie>('Movie', MovieSchema); 