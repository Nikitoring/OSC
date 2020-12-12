
import pkg from 'mongoose';
const { Schema, model } = pkg;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  creatAt: {
    type: Number
  }
})
const User = model('User', userSchema)

export default User
