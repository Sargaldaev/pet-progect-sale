import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import usersRouter from './routers/users';
import housesRouter from './routers/houses';
import districtsRouter from './routers/districts';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/users', usersRouter);
app.use('/houses', housesRouter);
app.use('/districts', districtsRouter);

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`server started on ${port} port`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch((e) => console.error(e));