import mongoose from 'mongoose';
import User from './User';

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
// Todo можно добавить description
  area: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  numberOfRooms: {
    type: Number,
    required: true,
  },

  image: {
    type: String
  },

  isPublished: {
    type:Boolean,
    default:false
  }

});

const House = mongoose.model('House', HouseSchema);
export default House;
