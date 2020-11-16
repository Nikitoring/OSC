import Cat from '../../models/Cat.js'
import checkAuth from '../../utils/auth.js'
import pkg from 'apollo-server-express';
const {AuthentificationError} = pkg;

export default {
  Query: {
    async cats() {
      try {
        const cats = await Cat.find()
        return cats
      } catch (err) {
        throw new Error(err)
      }
    },
    async cat(_, { catId }) {
      try {
        const kitty = await Cat.findById(catId)
        if (kitty) {
          return kitty
        } else {
          throw new Error('Cat not found :(')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    createCat: async (_, { name, description }, context) => {
      const user = checkAuth(context)
      const kitty = new Cat({
        name,
        description,
        date: new Date().toISOString(),
        user: user.id,
        username: user.username
      })
      await kitty.save()
      return kitty
    },
    deleteCat: async (_, {catId}, context) => {
      const user = checkAuth(context)
      try {
        const kitty = Cat.findById(catId)
        if (user.username === cat.username) {
          await kitty.delete()
          return 'Cat delete successfuly'
        } else {
          throw new AuthentificationError('Action not Allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
}
