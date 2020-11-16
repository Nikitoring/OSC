
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {UserInputError} from 'apollo-server-express'
import {SECRET_KEY} from '../../../config.js'
import User from "../../models/User.js";

import { validateRegisterInput, validateLoginInput } from '../../utils/validate.js'

const generateToken = (user) => {
  return jwt.sign({
    id:user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, {expiresIn: '1h'})
}

export default {
  Query: {
    users: () => User.find()
  },
  Mutation: {
    async login(_, {username,password}) {
      const {errors, valid} = validateLoginInput(username, password)
      if (!valid) {
        throw new UserInputError('Error', {errors})
      }
      const user = await User.findOne({username})
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('Wrong', {errors})
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong crendetails'
        throw new UserInputError('Wrong crendetails', {errors})
      }
      const token =generateToken(user)
      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register(_, {registerInput: {username,email,password, confirmPassword}}, context, info) {
      // Valid
      const {valid, err} = validateRegisterInput(username,email,password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Error', {err})
      }
      const user = User.findOne({username})
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      password = await bcrypt.hash(password,12)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })
      const res = await newUser.save()
      const token =generateToken(res)
      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}