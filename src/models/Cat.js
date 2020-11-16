
import pkg from 'mongoose';
const { Schema, model } = pkg;


const nowDate = new Date().getTime()
const catSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    default: nowDate
  },
  description: {
    type: String,
    required: false
  }
})
const Cat = model('Cat', catSchema)

export default Cat
