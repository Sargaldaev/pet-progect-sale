import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DistrictSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

const District = mongoose.model('District', DistrictSchema);
export default District;