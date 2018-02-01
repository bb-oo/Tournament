import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
const app = express()

app.use(express.static(__dirname + '/../client/static/'))
app.use(express.static(__dirname + '/../client/static/build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/static/index.html'))
})

app.listen(process.env.PORT)