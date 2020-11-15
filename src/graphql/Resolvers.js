// Imports: Axios

import Cat from "../models/Cat.js";

  const RESOLVERS = {
    Query: {
      test: () => `test`,
      cats: () => Cat.find()
    },
    Mutation: {
      createCat: async (_,{name})=> {
        const kitty = new Cat({name})
        await kitty.save()
        return kitty
      }
    }
}
export default RESOLVERS;