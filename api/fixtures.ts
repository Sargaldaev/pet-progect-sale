import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import * as crypto from 'crypto';
import House from './models/House';
import District from './models/District';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('districts');
    await db.dropCollection('houses');
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

  const [district_01, district_02, district_03, district_04] = await District.create(
    { name: 'Октябрьский район' },
    { name: 'Первомайский район' },
    { name: 'Свердловский район' },
    { name: 'Ленинский район' },
  );

  await House.create(
    {
      user: user._id,
      district: district_01._id,
      price: '150к$',
      numberOfRooms: 2,
      image: 'fixtures/house.jpeg',
      isPublished: true,
    },

    {
      user: user._id,
      district: district_02._id,
      price: '73к$',
      numberOfRooms: 3,
      image: 'fixtures/house.jpeg',
      isPublished: true,
    },

    {
      user: admin._id,
      district: district_03._id,
      price: '100к$',
      numberOfRooms: 1,
      image: 'fixtures/house.jpeg',
      isPublished: true,
    },

    {
      user: admin._id,
      district: district_04._id,
      price: '50к$',
      numberOfRooms: 1,
      image: 'fixtures/house.jpeg',
      isPublished: true,
    },
  );

  await db.close();
};

run().catch(console.error);