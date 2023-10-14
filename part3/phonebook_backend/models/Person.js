
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
	    name: String,
	    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})


let mongoUrl = process.env.MONGO_URL.replace("__PASSWORD__", process.env.MONGO_PW)

mongoose.connect(mongoUrl).then(result => {
	console.log("Connected to MongoDB")
	password = undefined
	mongoUrl = undefined
}).catch((error) => {
	console.log("Error connecting to MongoDB:", error.message)
})

module.exports = mongoose.model("Person", personSchema)
