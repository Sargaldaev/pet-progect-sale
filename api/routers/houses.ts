import express from 'express';
import { Error } from 'mongoose';
import House from '../models/House';
import auth, { RequestWithUser } from '../middleware/auth';
import { imagesUpload } from '../multer';
import permit from '../middleware/permit';
import { HouseEdit, SearchByCategory } from '../types';

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
    const houses = await House.find();

    return res.send({message: 'Недвижимости которые были найдены', houses});
  } catch (error) {
    return next(error);
  }
});

housesRouter.post('/searchByCategory', async (req, res, next) => {
  try {
    const searchByCategory: SearchByCategory = {
      district: req.body.district,
      priceFrom: req.body.priceFrom,
      priceTo: req.body.priceTo,
      numberOfRooms: req.body.numberOfRooms,
    };

    if (!searchByCategory.priceFrom && !searchByCategory.priceTo && !searchByCategory.district) {
      const houses = await House.find({
        numberOfRooms: searchByCategory.numberOfRooms,
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    if (!searchByCategory.numberOfRooms && !searchByCategory.district) {
      const houses = await House.find({
        price: {$gte: `${searchByCategory.priceFrom}к$`, $lte: `${searchByCategory.priceTo}к$`},
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    if (
      !searchByCategory.numberOfRooms &&
      !searchByCategory.priceTo &&
      !searchByCategory.priceFrom
    ) {
      const houses = await House.find({
        district: searchByCategory.district,
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    if (!searchByCategory.district) {
      const houses = await House.find({
        price: {$gte: `${searchByCategory.priceFrom}к$`, $lte: `${searchByCategory.priceTo}к$`},
        numberOfRooms: searchByCategory.numberOfRooms,
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    if (!searchByCategory.priceFrom && !searchByCategory.priceTo) {
      const houses = await House.find({
        district: searchByCategory.district,
        numberOfRooms: searchByCategory.numberOfRooms,
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    if (!searchByCategory.numberOfRooms) {
      const houses = await House.find({
        district: searchByCategory.district,
        price: {$gte: `${searchByCategory.priceFrom}к$`, $lte: `${searchByCategory.priceTo}к$`},
      });
      return res.send({message: 'Недвижимости которые были найдены', houses});
    }

    const houses = await House.find({
      district: searchByCategory.district ? searchByCategory.district : '',
      price: {$gte: `${searchByCategory.priceFrom}к$`, $lte: `${searchByCategory.priceTo}к$`},
      numberOfRooms: searchByCategory.numberOfRooms,
    });

    if (!houses.length) {
      const houses = await House.find();
      return res.send({
        message: 'Нет совпадений по вашему запросу, так же можете посмотреть эти объявлении',
        houses,
      });
    }

    return res.send({message: 'Недвижимости которые были найдены', houses});
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
  permit('user'),
  imagesUpload.single('image'),
  async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    const userId = user._id.toString();

    try {
      const _id = req.params.id;
      const houseId = await House.findById(_id);
      const houseUser = houseId?.user.toString();
      const file = req.file ? req.file.filename : null;

      const updateValues = req.body as HouseEdit;

      const updatedObj: HouseEdit = {};

      const keys = Object.keys(updateValues) as unknown as Array<keyof HouseEdit>;

      keys.forEach((key) => {
        updatedObj[key] = updateValues[key];
      });

      if (file) {
        updatedObj.image = file;
      }


      if (houseUser === userId) {
        const house = await House.findOneAndUpdate({_id}, updatedObj);
        if (!house) {
          return res.status(404).send({message: 'House not found'});
        }
      }

      return res.send({message: 'can\'t update'});
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        return res.status(422).send(error);
      }
      return next(error);
    }
  },
);
export default housesRouter;