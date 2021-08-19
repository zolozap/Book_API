const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const bookController = require("../controllers/book-controller")
const Book = require('../models/book-model')

require('dotenv').config()

mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))  

let routes = app => {
    // Swagger
    router.use('/api-docs', swaggerUi.serve)
    router.get('/api-docs', swaggerUi.setup(swaggerDocument))

    router.get('/book', async (req, res) => {
        await Book.find()
        .then(books => res.status(200).send(books))
        .catch(err => res.status(404).json({ msg: 'No books found.' }))
    })

    router.get('/book/:bookId', async (req, res) => {
      try{
        await Book.find({ _id: mongoose.Types.ObjectId(req.params.bookId) })
        .then(book => res.status(200).send(book))
        .catch(err => res.status(404).json({ msg: 'No book found.' }))
      }catch(error){
        return res.status(404).send({message:`${error}`})
      }
        
    })

    router.get('/book/image/:imageId', bookController.getFile)

    router.post("/book/upload", bookController.uploadFile)

    router.patch('/book/:bookId', bookController.updateBook)

    router.delete('/book/:bookId', async (req, res) => {
      try{
        await Book.deleteOne({ _id: mongoose.Types.ObjectId(req.params.bookId) })
        res.status(200).send({ message:`deleted book ${req.params.bookId} success.` })
      }catch(error){
        return res.status(404).send({message:`${error}`})
      }
    })

  return app.use("/", router)
};

module.exports = routes