import express from 'express';
import User, {UserMethods} from '../models/User';
import {Error, HydratedDocument} from 'mongoose';
import auth, {RequestWithUser} from '../middleware/auth';
import {OAuth2Client} from 'google-auth-library';
import config from '../config';

const usersRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/', async (req, res, next) => {

  console.log(0);
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
      phoneNumber:req.body.phoneNumber,
    });

    console.log(user);

    user.generateToken();

    await user.save();
    return res.send(user);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send({ error: 'Wrong username or password ' });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: 'Wrong username or password' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(400).send({ error: 'Wrong username or password ' });
    }

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

usersRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).send({ error: 'Google login error!' });
    }

    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];

    if (!email) {
      return res.status(400).send({ error: 'Not enough user data to continue' });
    }
    let user = await User.findOne({ googleID: id });

    if (!user) {
      user = new User({
        username: email,
        password: crypto.randomUUID(),
        googleID: id,
        displayName,
      });

    }

    user.generateToken();
    await user.save();
    return res.send({ message: 'Login with Google successful!', user });
  } catch (e) {
    return next(e);
  }
});


usersRouter.delete('/sessions', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user as HydratedDocument<UserMethods>;
    user.generateToken();
    await user.save();

    return res.send({ message: 'SUCCESS' });
  } catch (e) {
    next(e);
  }
});

export default usersRouter;
