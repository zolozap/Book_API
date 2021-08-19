const util = require("util")
const multer = require("multer")
const {GridFsStorage} = require("multer-gridfs-storage")
const maxSize = 3 * 1024 * 1024
require('dotenv').config()

var storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"]

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-book-${file.originalname}`
      return filename
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-book-${file.originalname}`
    }
  }
})

var uploadFile = multer({ 
  storage: storage,
  limits: { fileSize: maxSize }
}).single("file")
var uploadFilesMiddleware = util.promisify(uploadFile)

module.exports = uploadFilesMiddleware