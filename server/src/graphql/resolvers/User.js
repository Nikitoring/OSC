
import bcrypt from 'bcryptjs'
import {UserInputError} from 'apollo-server-express'
import User from "../../models/User.js";
import { validateRegisterInput, validateLoginInput } from '../../utils/validate.js'
import { createAccessToken, createRefreshToken } from "../../utils/auth.js";
import {sendRefreshToken} from '../../utils/sendRefreshToken.js'
import pkg from 'jsonwebtoken';
const {verify} = pkg;

export default {
  Query: {
    users: () => User.find(),
    me: async (_,{},{ req, res }) => {
      const authorization = req.headers["authorization"]
      if (!authorization) {
        return null
      }

    try {
      const token = authorization.split(" ")[1];
      const payload = verify(token, process.env.ACCESS_SECRET_KEY)
      const user = await User.findOne({_id: payload.id}).exec()
      return user
    } catch (err) {
      console.log(err);
      return null
    }
    }
  },
  Mutation: {
    async login(_, {username,password}, {res}) {
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

      // login successful
      let token = createAccessToken(user)

      sendRefreshToken(res, token);

      return {
        ...user._doc,
        id: user._id,
        token: token
      }
    },
    async logout (_,{},{res}) {
      sendRefreshToken(res, '')
      return true
    },
    async registration(_, {registrationInput: {username,email,password, confirmPassword}}) {
      // Valid
      const {valid, err} = validateRegisterInput(username,email,password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Error', {err})
      }
      const user = await User.findOne({username: username}).exec()
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      const takenEmail = await User.findOne({email: email}).exec()
      if (takenEmail) {
        throw new UserInputError('Email is taken',{
          errors: {
            email: 'This email is taken'
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
      const token = createAccessToken(res)
      sendRefreshToken(res, token);
      return {
        ...res._doc,
        id: res._id,
        token: token
      }
    }
  }
}