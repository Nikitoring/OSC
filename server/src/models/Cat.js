
import pkg from 'mongoose';
const { Schema, model } = pkg;

const catSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  description: {
    type: String,
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
})
const Cat = model('Cat', catSchema)

export default Cat
