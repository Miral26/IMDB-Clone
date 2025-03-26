import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Actor from '../models/Actor';

const router = express.Router();

// Get all actors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const actors = await Actor.find().populate({
      path: 'movies',
      select: 'name yearOfRelease'
    });
    res.json(actors);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Get actor by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const actor = await Actor.findById(req.params.id).populate({
      path: 'movies',
      select: 'name yearOfRelease'
    });
    if (!actor) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    res.json(actor);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Create actor
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

      const actor = new Actor(req.body);
      await actor.save();
      res.status(201).json(actor);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Update actor
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

      const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!actor) {
        return res.status(404).json({ message: 'Actor not found' });
      }

      res.json(actor);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Delete actor
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

export default router; 