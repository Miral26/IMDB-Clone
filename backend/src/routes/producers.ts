import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Producer from '../models/Producer';

const router = express.Router();

// Get all producers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const producers = await Producer.find().populate('movies');
    res.json(producers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Get producer by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const producer = await Producer.findById(req.params.id).populate('movies');
    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }
    res.json(producer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Create producer
router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('gender').notEmpty().trim(),
    body('dateOfBirth').notEmpty().isISO8601(),
    body('bio').notEmpty().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const producer = new Producer(req.body);
      await producer.save();
      res.status(201).json(producer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Update producer
router.put(
  '/:id',
  [
    body('name').optional().trim(),
    body('gender').optional().trim(),
    body('dateOfBirth').optional().isISO8601(),
    body('bio').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const producer = await Producer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!producer) {
        return res.status(404).json({ message: 'Producer not found' });
      }

      res.json(producer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Delete producer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const producer = await Producer.findByIdAndDelete(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }
    res.json({ message: 'Producer deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

export default router; 