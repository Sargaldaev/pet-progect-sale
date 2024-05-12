import mongoose from 'mongoose';
import User from './User';
import District from './District';

const Schema = mongoose.Schema;

const HouseSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => await User.findById(value),
      message: 'User does not exist',
    },
  },

  district: {
    type: mongoose.Types.ObjectId,
    ref: 'District',
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => await District.findById(value),
      message: 'District does not exist',
    },
  },

  price: {
    type: String,
    required: true,
  },

  numberOfRooms: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  isPublished: {
    type: Boolean,
    default: false,
  },
});

const House = mongoose.model('House', HouseSchema);
export default House;