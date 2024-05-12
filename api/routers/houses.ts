import express from 'express';
import { Error } from 'mongoose';
import House from '../models/House';
import auth, { RequestWithUser } from '../middleware/auth';
import { imagesUpload } from '../multer';
import permit from '../middleware/permit';

const housesRouter = express.Router();

housesRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  try {
    const house = new House({
      user: user._id,
      district: req.body.district,
      price: req.body.price,
      numberOfRooms: req.body.numberOfRooms,
      image: req.file ? req.file.filename : null,
    });

    await house.save();

    return res.send(house);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
});

housesRouter.get('/', async (req, res, next) => {
  try {
    const houses = await House.find()

    return res.send(houses);
  } catch (error) {
    return next(error);
  }
});

housesRouter.get('/getByCategory', async (req, res, next) => {
  try {

    const filteredHouses = await House.find({
      district: '6640aa712ca7e00742e492ab',
      price: {$gte: 12, $lte: 160},
      numberOfRooms: 2
    });
    console.log(filteredHouses);

    return res.send(filteredHouses);
  } catch (error) {
    return next(error);
  }
});

housesRouter.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const house = await House.findById(_id).populate('district');

    if (!house) {
      return res.send({message: 'Id not found'});
    }

    return res.send(house);
  } catch (e) {
    res.send(e);
  }
});

housesRouter.delete('/:id', auth, permit('admin', 'user'), async (req, res) => {
  const user = (req as RequestWithUser).user;

  const userId = user._id.toString();
  const _id = req.params.id;

  try {
    if (user.role === 'admin') {
      const house = await House.findByIdAndDelete(_id);
      if (!house) {
        return res.status(404).send({message: 'House not found'});
      }
      return res.send({message: 'House deleted'});
    }

    const houseId = await House.findOne({_id});
    const houseUser = houseId?.user.toString();
    const isPublished = houseId?.isPublished;

    if (!houseId) {
      return res.status(404).send({message: 'House not found'});
    }

    if (userId === houseUser && isPublished === false) {
      await House.deleteOne({_id: houseId._id});
      return res.send({message: 'House deleted'});
    } else if (userId !== houseUser || isPublished === true) {
      return res.send({message: 'Cannot be deleted'});
    }
  } catch (e) {
    return res.send(e);
  }
});

housesRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res) => {
  try {
    const houseId = req.params.id;
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).send({message: 'House not found'});
    }

    house.isPublished = !house.isPublished;
    await house.save();

    res.send({message: 'House publication status toggled successfully'});
  } catch (e) {
    res.status(500).send({error: 'Internal Server Error'});
  }
});

housesRouter.patch(
  '/:id',
  auth,
  permit('admin'),
  imagesUpload.single('image'),
  async (req, res) => {
    try {
      const _id = req.params.id;

      const house = await House.findOneAndUpdate(
        {_id},
        {
          district: req.body.district,
          price: req.body.price,
          numberOfRooms: req.body.numberOfRooms,
          image: req.file ? req.file.filename : null,
        },
      );

      if (!house) {
        return res.status(404).send({message: 'House not found'});
      }

      res.send({message: 'House filed updated'});
    } catch (e) {
      res.status(500).send({error: 'Internal Server Error'});
    }
  },
);
export default housesRouter;