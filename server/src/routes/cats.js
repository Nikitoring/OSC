const {Router} =require('express')
const Cat = require('../models/cat.js')

const router = Router()

router.get('/', async (req,res)=> {
  try {
    const cats = await Cat.find()
    if (!cats) throw new Error('No Cats')
    res.status(200).json(cats)
  }catch (err) {
    console.log(err)
    res.status(400).json(err.message)
  }
})


router.post('/', async (req,res)=> {
  const {
    name
  } = req.body
  const newCat = new Cat({name, date})

  try {
    const cat = await newCat.save()
    if (!cat) throw new Error('No cat save')
    res.status(200).json(cat)
  } catch (error) {
    res.status(500).json({mess: error.message})
  }
})

module.exports = router