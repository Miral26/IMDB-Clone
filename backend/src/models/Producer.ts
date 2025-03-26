import mongoose, { Schema, Document } from 'mongoose';

export interface IProducer extends Document {
  name: string;
  gender: string;
  dateOfBirth: Date;
  bio: string;
  movies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProducerSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required']
  },
  movies: [{
    type: Schema.Types.ObjectId,
    ref: 'Movie'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IProducer>('Producer', ProducerSchema); 