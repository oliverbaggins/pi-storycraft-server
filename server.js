require('dotenv').config()
const PORT = 5000
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const userStoryRoutes = require('./routes/userStoryRoutes')
const signupRoute = require('./routes/signupRoute')
const loginRoute = require('./routes/loginRoute')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could no connect to MongoDB...', err))

app.use(bodyParser.json())
app.use(cors())

app.use('/api/user', signupRoute)
app.use('/api/user', loginRoute)
app.use('/api/user-stories', userStoryRoutes)

app.listen(PORT, () => 
    console.log('Your server is running on PORT ' + PORT)
)
