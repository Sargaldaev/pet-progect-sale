import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import * as crypto from 'crypto';
import House from './models/House';
import District from './models/District';
import district from './models/District';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('houses');
    await db.dropCollection('districts');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user] = await User.create(
    {
      username: 'User',
      password: '123',
      displayName: 'Bob',
      phoneNumber: '0701838363',
      role: 'user',
      token: crypto.randomUUID(),
    },
    {
      username: 'Admin',
      password: '123',
      displayName: 'Triss',
      phoneNumber: '0701838353',
      role: 'admin',
      token: crypto.randomUUID(),
    },
  );

  const [district1, district2, district3, district4] = await District.create(
    {name: 'Джал'},
    {name: 'Асанбай'},
    {name: 'Политех'},
    {name: '5мкр'}
  );

  await House.create(
    {
      user: user._id,
      district: district1._id,
      price: '150к$',
      numberOfRooms: 2,
      description: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n' +
        '            A architecto asperiores blanditiis debitis eligendi illum ipsum\n' +
        '            iste itaque modi officia omnis porro quis reiciendis rem repudiandae sit,\n' +
        '            sunt totam ut.',
      image: 'fixtures/house.jpeg',
      isPublished: true
    },

    {
      user: user._id,
      district: district2._id,
      price: '73к$',
      numberOfRooms: 3,
      description: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n' +
        '            A architecto asperiores blanditiis debitis eligendi illum ipsum\n' +
        '            iste itaque modi officia omnis porro quis reiciendis rem repudiandae sit,\n' +
        '            sunt totam ut.',
      image: 'fixtures/house.jpeg',
      isPublished: true
    },

    {
      user: admin._id,
      district: district3._id,
      price: '100к$',
      numberOfRooms: 1,
      description: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n' +
        '            A architecto asperiores blanditiis debitis eligendi illum ipsum\n' +
        '            iste itaque modi officia omnis porro quis reiciendis rem repudiandae sit,\n' +
        '            sunt totam ut.',
      image: 'fixtures/house.jpeg',
      isPublished: true
    },

    {
      user: admin._id,
      district: district4._id,
      price: '50к$',
      description: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n' +
        '            A architecto asperiores blanditiis debitis eligendi illum ipsum\n' +
        '            iste itaque modi officia omnis porro quis reiciendis rem repudiandae sit,\n' +
        '            sunt totam ut.',
      numberOfRooms: 1,
      image: 'fixtures/house.jpeg',
      isPublished: true
    },
  );


  await db.close();
};

run().catch(console.error);
