require('express-async-errors')
require('dotenv/config')

const migrationsRun = require('./database/sqlite/migrations')
const AppError = require("./utils/AppError")
const uploadConfig = require('./configs/upload')

const cors = require('cors')
const path = require("path")
const express = require('express');

const routes = require('./routes')

migrationsRun()

const app = express();
app.use(cors())
app.use(express.json())

app.use('/files/avatars', express.static(path.join(uploadConfig.UPLOADS_FOLDER, 'avatars')));

// Para arquivos de banner
app.use('/files/banners', express.static(path.join(uploadConfig.UPLOADS_FOLDER, 'banners')));


app.use(routes)


app.use(( error, request, response , next) => {
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))