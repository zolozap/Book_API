const upload = require("../middleware/book-middleware")
const Book = require('../models/book-model')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`)
// require('dotenv').config()

var gfs
const conn = mongoose.connection //mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo)
})

const uploadFile = async (req, res) => {
  try {
    
    const image = await upload(req, res)
    console.log("files:::",req.file)

    const newBook = new Book({
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description,
      price: req.body.price
    })

    newBook.save().then(book => res.status(200).send({message:'Book has been uploaded.', book}))
    if (req.file == undefined) {
      return res.status(200).send({message:'You must select a file (JPG,PNG).'})
    }
  } catch (error) {
    console.log(error)
    return res.status(300).send({message:`${error}`})
  }
}

const getFile = async (req, res) =>{
  console.log(req.params)
  gfs.collection('photos').findOne({
    filename: req.params.imageId
  }, (err, file) => {
      if (err) {
          // report the error
          console.log(err)
          return res.status(404).send({message:`${err}`})
      } else {
          // detect the content type and set the appropriate response headers.
          let mimeType = file.contentType
          if (!mimeType) {
              mimeType = mime.lookup(file.filename)
          }
          const readStream = gfs.createReadStream({
            filename: file.filename
          })
          var base64data = ''

          readStream.on("data", chunk => {
            base64data = new Buffer(chunk).toString('base64')
          })

          readStream.on('error', err => {
              // report stream error
              return res.status(404).send({message:`${err}`})
          })

          readStream.on("end", () => {
            return res.send(base64data)
          })
      }
  })

}

const updateBook = async (req, res) => {
  try {
    if (req.file){
      const image = await upload(req, res)
      console.log("files:::",req.file)
    }
    console.log("update:::", req.params, req.body)
    let updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
    }
    await Book.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.bookId) }, req.body, (err, book) => {
      res.status(200).send({message:'Book has been update.', book})
    })

  } catch (error) {
    console.log(error)
    return res.status(300).send({message:`${error}`})
  }
}

module.exports = {
  uploadFile: uploadFile,
  getFile: getFile,
  updateBook: updateBook
}