import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Movie from '../models/Movie';
import Producer from '../models/Producer';
import Actor from '../models/Actor';

const router = express.Router();

// Get all movies
router.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await Movie.find()
      .populate('producer', 'name')
      .populate('actors', 'name');
    res.json(movies);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Get movie by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('producer', 'name')
      .populate('actors', 'name');
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// Create movie
router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('yearOfRelease').isInt({ min: 1888 }),
    body('plot').notEmpty().trim(),
    body('poster').notEmpty().trim(),
    body('producer').notEmpty().isMongoId(),
    body('actors').isArray(),
    body('actors.*').isMongoId(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const movie = new Movie(req.body);
      await movie.save();

      // Update producer's movies array
      await Producer.findByIdAndUpdate(
        req.body.producer,
        { $push: { movies: movie._id } }
      );

      // Update each actor's movies array
      await Promise.all(
        req.body.actors.map((actorId: string) =>
          Actor.findByIdAndUpdate(
            actorId,
            { $push: { movies: movie._id } }
          )
        )
      );

      res.status(201).json(movie);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Update movie
router.put(
  '/:id',
  [
    body('name').optional().trim(),
    body('yearOfRelease').optional().isInt({ min: 1888 }),
    body('plot').optional().trim(),
    body('poster').optional().trim(),
    body('producer').optional().isMongoId(),
    body('actors').optional().isArray(),
    body('actors.*').optional().isMongoId(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get the existing movie to compare changes
      const existingMovie = await Movie.findById(req.params.id);
      if (!existingMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      // Update the movie
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      // If producer changed, update both old and new producer's movie arrays
      if (req.body.producer && req.body.producer !== existingMovie.producer.toString()) {
        // Remove movie from old producer
        await Producer.findByIdAndUpdate(
          existingMovie.producer,
          { $pull: { movies: updatedMovie._id } }
        );
        // Add movie to new producer
        await Producer.findByIdAndUpdate(
          req.body.producer,
          { $push: { movies: updatedMovie._id } }
        );
      }

      // If actors changed, update both old and new actors' movie arrays
      if (req.body.actors) {
        const oldActorIds = existingMovie.actors.map(actor => actor.toString());
        const newActorIds = req.body.actors as string[];

        // Remove movie from actors no longer in the movie
        await Actor.updateMany(
          { _id: { $in: oldActorIds.filter(id => !newActorIds.includes(id)) } },
          { $pull: { movies: updatedMovie._id } }
        );

        // Add movie to new actors
        await Actor.updateMany(
          { _id: { $in: newActorIds.filter(id => !oldActorIds.includes(id)) } },
          { $push: { movies: updatedMovie._id } }
        );
      }

      // Populate the response with producer and actor details
      const populatedMovie = await Movie.findById(updatedMovie._id)
        .populate('producer', 'name')
        .populate('actors', 'name');

      res.json(populatedMovie);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Delete movie
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Remove movie from producer's movies array
    await Producer.findByIdAndUpdate(
      movie.producer,
      { $pull: { movies: movie._id } }
    );

    // Remove movie from all actors' movies arrays
    await Actor.updateMany(
      { _id: { $in: movie.actors } },
      { $pull: { movies: movie._id } }
    );

    // Delete the movie
    await movie.deleteOne();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});

export default router; 