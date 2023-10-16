
// Requires MONGO_URL and MONGO_PW set in environment

const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(val) {
        return /^\d{2,3}-\d{4,12}$/.test(val)
      },
      message: props => `${props.value} is not a valid phone number.`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

let mongoUrl = process.env.MONGO_URL.replace('__PASSWORD__', process.env.MONGO_PW)

mongoose.connect(mongoUrl).then(() => {
  console.log('Connected to MongoDB')
  mongoUrl = undefined
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error.message)
})

module.exports = mongoose.model('Person', personSchema)
