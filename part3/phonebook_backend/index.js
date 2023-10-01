
const morgan = require('morgan')
const express = require('express')


const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config();

const INFO_HTML = "<!DOCTYPE html><html lang='en'><head><title>Info</title></head><body><p>Phonebook has info for COUNT people.</p><p>DATE</p></body></html>"

// Sanity check: Only allow up to MAX_ITEMS to be 
// entered into the list of people
const MAX_ITEMS = 10

// Sanity check: Maximum string parameter length
const MAX_PARAM_LEN = 80



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


const isBadRequest = (req) => {
    return (PERSON_LIST.length >= MAX_ITEMS ||
        req.body.name.length > MAX_PARAM_LEN ||
        req.body.number.length > MAX_PARAM_LEN)
}

const app = express()

// Log request body on POST
morgan.token("post-body", function (req, res) { 
    if(req.method == "POST") {
        return JSON.stringify(req.body)
    }
})


app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"))

// Serve static content from dist
app.use(express.static('dist'))

// Parse JSON payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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


app.put("/api/persons/:id", (req, res) => {

    const targetId = req.params.id

    const person = PERSON_LIST.find(p => p.id == targetId)

    if(!person){
        res.status(404)
        res.json({"error": "Not found"})
        return
    }

    if(!req.body || 
        req.body.name === undefined || 
        req.body.number === undefined ||
        isBadRequest(req)) {

        res.status(400)
        res.json({"error": "Bad request"})
        return
    }

    person.name = req.body.name
    person.number = req.body.number

    res.json({"messager": "Item updated"})
})



app.post("/api/persons", (req, res) => {
   
    console.log(req.body)

    if(!req.body || 
        req.body.name === undefined || 
        req.body.number === undefined ||
        isBadRequest(req)) {

        res.status(400)
        res.json({"error": "Bad request"})
        return
    }

    if(PERSON_LIST.length >= MAX_ITEMS ||
        req.body.name.length > MAX_PARAM_LEN ||
        req.body.number.length > MAX_PARAM_LEN) {

        res.status(400)
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



const port = process.env.LISTEN_PORT || 3000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})


