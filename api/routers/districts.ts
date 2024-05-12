import express from 'express';
import District from '../models/District';

const districtsRouter = express.Router();

districtsRouter.get('/', async (_req, res, next) => {
  try {
    const districts = await District.find();

    return res.send(districts);
  } catch (error) {
    return next(error);
  }
});

export default districtsRouter;