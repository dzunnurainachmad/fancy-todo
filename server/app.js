if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const cors = require("cors")
const express = require("express")
const app = express()
const router = require("./routes/index.js")
const port = process.env.PORT || 3000
const errorHandler = require("./middleware/errorhandler")

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(router)

app.use(errorHandler)

app.listen(port, () => console.log(`server running at port ${port}`))