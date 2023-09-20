
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')


require('dotenv').config();

const INFO_HTML = "<!DOCTYPE html><html lang='en'><head><title>Info</title></head><body><p>Phonebook has info for COUNT people.</p><p>DATE</p></body></html>"

PERSON_LIST = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const app = express()

// Log request body on POST
morgan.token("post-body", function (req, res) { 
    if(req.method == "POST") {
        return JSON.stringify(req.body)
    }
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"))

// Required for parsing of POST body to objects.
app.use(express.urlencoded({
    extended: true
}))

// Enable CORS wrapper
app.use(cors())

app.get("/info", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(INFO_HTML.replace("DATE", Date()).replace("COUNT", PERSON_LIST.length))
})

app.get("/api/persons", (req, res) => {    
    res.json(PERSON_LIST)
})

app.get("/api/persons/:id", (req, res) => {
    
    const targetId = req.params.id
    console.log(`Lookup person ID: '${targetId}'`)

    const person = PERSON_LIST.find(p => p.id == targetId)

    if(!person){
        res.status(404)
        res.json({"error": "Not found"})
    } else {
        res.json(person)
    }
})

app.delete("/api/persons/:id", (req, res) => {

    const targetId = req.params.id
    console.log(`Lookup person ID: '${targetId}'`)

    const person = PERSON_LIST.find(p => p.id == targetId)

    if(!person){

        res.status(404)
        res.json({"error": "Not found"})

    } else {

        PERSON_LIST = PERSON_LIST.filter(p => p.id != targetId)

        res.json({"messager": "Item deleted"})
    }
})

app.post("/api/persons", (req, res) => {

    if(!req.body || 
        req.body.name === undefined || 
        req.body.number === undefined ) {

        res.status(400)
        res.json({"error": "Bad request"})
        return
    }

    if(PERSON_LIST.some(p => p.name == req.body.name)){
        res.status(400)
        res.json({ error: 'name must be unique' })
        return
    }

    const newId = Math.floor(Math.random() * (100 - PERSON_LIST.length + 1)) + PERSON_LIST.length

    newPerson = {
        "id": newId,
        "name": req.body.name, 
        "number": req.body.number
    }

    PERSON_LIST.push(newPerson)

    res.status(201)
    res.json({"id": newPerson.id})
})

if(!process.env.LISTEN_PORT){
    throw Error("LISTEN_PORT not set.")
}

app.listen(process.env.LISTEN_PORT)
console.log(`Server listening on port ${process.env.LISTEN_PORT}`)

