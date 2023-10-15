/*

Prevents more than MAX_ITEMS from being inserted into
the DB or returned from it at one time. This restriction
is meant to guard against meanies running out my 
free account.

*/

// Sanity check: Only allow up to MAX_ITEMS to be 
// entered into the list of people
const MAX_ITEMS = 50

// Sanity check: Maximum string parameter length
const MAX_PARAM_LEN = 50

// Sanity checker
const isBadRequest = (req) => {

    const vals = Object.values(req.body)

    if(vals === undefined || vals.length != 2) {
        return true
    }

    return Object.values(req.body).some(val => {
        if(val === undefined || val.length == 0 || val.length > MAX_PARAM_LEN){
            return true
        }
    })
}

// MongoDB ID checker
const isBadId = (id) => {
    return !(/^[0-9a-fA-F]{24}$/.test(id))
}

require("dotenv").config();

const morgan = require("morgan")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

// Mondgoose models of 
// phonebook entries
const Person = require("./models/Person");

const INFO_HTML = "<!DOCTYPE html><html lang='en'><head><title>Info</title></head><body><p>Phonebook has info for COUNT people.</p><p>DATE</p></body></html>"


// Log request body on POST
morgan.token("post-body", function (req, res) { 
    if(req.method == "POST") {
        return JSON.stringify(req.body)
    }
})


const app = express()

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"))

// Serve static content from dist
app.use(express.static('dist'))

// Parse JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS wrapper
app.use(cors())

// HTML info page
app.get("/info", (req, res, next) => {

    Person.countDocuments({}).then(result => {

        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(INFO_HTML.replace("DATE", Date()).replace("COUNT", result))

    }).catch(error => next(error))
})


// All entries, up to MAX_ITEMS
app.get("/api/persons", (req, res, next) => { 
   
    Person.find({}).limit(MAX_ITEMS).then(result => {
    
        res.json(result)

    }).catch(error => next(error))
})


// Individual record, by ID
app.get("/api/persons/:id", (req, res, next) => {
    
    const targetId = req.params.id

    if(isBadId(targetId)){
        next("Bad ID format")        
        return
    }

    Person.findById(targetId).then(person => {

        if(person) {
            res.json(person)
        } else {
            next("Item not found.")
        }

    }).catch(error => next(error))
})


// Delete item by ID
app.delete("/api/persons/:id", (req, res, next) => {

    const targetId = req.params.id

    if(isBadId(targetId)){
        next("Bad ID format")
        return
    }
 
    Person.findByIdAndDelete(targetId).then(person => {

        if(person){
            res.json({"message": "Item deleted"})
        } else {
            next("Item not found")
        }

    }).catch(error => next(error))
})


// Update person by ID
app.put("/api/persons/:id", (req, res, next) => {

    const targetId = req.params.id

    if(isBadId(targetId)){
        next("Bad ID format")        
        return
    }
   
    if(!req.body || isBadRequest(req)) {
        next("Bad request")
        return
    }

    // Fields to update
    const updatePerson = {
        name: req.body.name,
        number: req.body.number
    }

    Person.findByIdAndUpdate(targetId, updatePerson).then((person) => {
     
        if(person){
            res.json({"message": "Item Updated"})
        } else {
            next("Item not found")
        }

    }).catch(error => next(error))
})


// Inser new person. Return new ID
app.post("/api/persons", (req, res, next) => {
   
    console.log(req.body)

    if(!req.body || isBadRequest(req)) {
        next("Bad parameters.")
        return
    }

    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    // Limit number of items in db
    Person.countDocuments().then(count => {

        if(count < MAX_ITEMS){

            person.save().then((newPerson) => { 

                res.status(201)
                res.json({"id": newPerson.id})
        
            }).catch(error => next(error))

        } else {

            next("Too many items.")
        }
    })
})

// Middleware error handler
const errorHandler = (error, req, res, next) => {

    message = error.message ? error.message: error

    console.error(message)

    return res.status(400).send({error: message})
}

app.use(errorHandler)

const port = process.env.LISTEN_PORT || 3000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
