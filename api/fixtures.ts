import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import * as crypto from 'crypto';
import House from './models/House';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
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

  await House.create(
    {
      user: user._id,
      area: 'Политех',
      price: '150к$',
      numberOfRooms: 2,
      image: 'fixtures/user.png',
      isPublished:true
    },

    {
      user: user._id,
      area: 'Джал',
      price: '73к$',
      numberOfRooms: 3,
      image: 'fixtures/user.png',
      isPublished:true
    },

    {
      user: admin._id,
      area: '7мкр',
      price: '100к$',
      numberOfRooms: 1,
      image: 'fixtures/user.png',
      isPublished:true
    },

    {
      user: admin._id,
      area: 'Асанбай',
      price: '50к$',
      numberOfRooms: 1,
      image: 'fixtures/user.png',
      isPublished:true
    },
  );


  await db.close();
};

run().catch(console.error);
