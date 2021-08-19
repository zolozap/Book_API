const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const initRoutes = require("./routes/index")
const app = express()

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
)
initRoutes(app)

app.listen(port, err => {
    if (err)
        throw err
    console.log(`Server running on ${port}`)
})