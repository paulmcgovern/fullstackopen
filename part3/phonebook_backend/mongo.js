/*

Set MongoDB connection URL in environment as MONGO_URL. The
URL must contain placeholder '__PASSWORD__'.

Parameters:
  Password
  Name
  Number

If only the password is provided, all the entries in the
phonebook are printed to the console. If the name and
number are provided, a new entry in insterted into the DB.

*/

// Max name and number length
const MAX_LEN = 50

const mongoose = require('mongoose')

require('dotenv').config()

mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


// Return a promise with all results.
const getAll = function () {

  return new Promise((resolve) => {

    Person.find({}).limit(100).then((result) => {
      resolve(result)
    })
  })
}

// Save a new Person in DB. Return new record.
const saveNew = function(name, number) {

  if(name.length === 0 || name.length > MAX_LEN) {
    return Promise.reject(new Error('Bad length for name'))
  }

  if(number.length === 0 || number.length > MAX_LEN) {
    return Promise.reject(new Error('Bad length for number'))
  }

  return new Promise((resolve) => {

    const person = new Person({
      name: name,
      number: number
    })

    person.save().then((result) => {
      resolve(result)
    })
  })
}


const main = async () => {

  // Args are either password only (3), or password, name,
  // and number (5)
  if(process.argv.length !== 3 && process.argv.length !== 5) {
    throw new Error('Bad command line parameters.')
  }

  const password = process.argv[2]

  const mongoUrl = process.env.MONGO_URL.replace('__PASSWORD__', password)

  await mongoose.connect(mongoUrl).catch(error => {
    console.log(`Error: ${error.message}`)
  })

  if(process.argv.length === 3){

    const people = await getAll().catch(error => {
      console.log(`Failed to fetch people ${error.message}`)
    })

    console.log('Phonebook:')

    people.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

  } else if(process.argv.length === 5){

    const name = process.argv[3]
    const number = process.argv[4]

    const person = await saveNew(name, number).catch(error => {
      console.log(`Failed to create person ${error}`) //.message}`)
    })

    if(person){
      console.log(`added ${person.name} number ${person.number} to phonebook`)
    }

  } else {
    throw Error('Bad number of parameters')
  }

  await mongoose.connection.close()
}

main()

