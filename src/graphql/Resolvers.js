// Imports: Axios

import Cat from "../models/Cat.js";

  const RESOLVERS = {
    Query: {
      test: () => `test`,
      cats: () => Cat.find(),
      cat: (id) => Cat.find(id===id)
    },
    Mutation: {
      createCat: async (_,{name, description})=> {
        const kitty = new Cat({name, description})
        await kitty.save()
        return kitty
      },
      editCat:async (_,catId,{name,description}) => {
        const kitty = await find(cats, {id:catId})
        if (!kitty) {
          throw new Error(`Couldn't find cat with id ${catId} `)
        }
        kitty.name = name
        kitty.description = description
        return kitty
      }
    }
}
export default RESOLVERS;