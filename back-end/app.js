require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about_us', async (req, res) => {
  
  const aboutData = {
    title: "Hello! My name is Eslem.",
    content: "I am majoring in CS and this is my last year at school! I am 23 and  form Istanbul. Previously I took Applied Internet Technologies with Prof.Versoza and I loved it. During that class we mostly focused on the technical side of building a software. Now I want to more focus of professional side of the work. Therefore I am so excited about this class. My other passion is music and I love learning how to play musical instruments. I can play around 5 different instruments so far! I also enjot travelling and volunteering of community service. I sometimes volunteer at 'God's Love We Deliver' for food packing. Other than that. I work as a QA Automation Engineer Intern at Centene part-time. I am responsible with improving automation of the medical claim processing through a company tool Centest. Yepp that's me, nice to meeting you!",
    imageUrl: "https://media.licdn.com/dms/image/v2/D4D03AQGPiyNi0tPPYw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727635987947?e=1762387200&v=beta&t=R-xv5Hju6sVyq8xG_Y4DMNwEmSKhLQuUhwBgP4FW3Vk" 
  }
  //console.log('Sending data:', aboutData) 
  res.json(aboutData)


})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
