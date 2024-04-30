import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import * as crypto from 'crypto';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user] = await User.create(
    {
      username: 'User',
      password: '123',
      displayName: 'Bob',
      avatar: 'fixtures/user.png',
      role: 'user',
      token: crypto.randomUUID(),
    },
    {
      username: 'Admin',
      password: '123',
      displayName: 'Triss',
      avatar: 'fixtures/admin.png',
      role: 'admin',
      token: crypto.randomUUID(),
    },
  );

  await db.close();
};

run().catch(console.error);
