import axios from 'axios'

const PERSON_SERVICE = "http://localhost:3001/persons"

const getAllPeople = () => {

    const request = axios.get(PERSON_SERVICE)

    return request.then(response => {return response.data})
}
  
const createPerson = newObject => {

    const request = axios.post(PERSON_SERVICE, newObject)

    return request.then(response => {return response.data})
}

const updatePerson = (newObject) => {

    const request = axios.put(`${PERSON_SERVICE}/${newObject.id}`, newObject)

    return request.then(response => {return response.data})
}

// Returns HTTP status
const deletePerson = (id) => {

    const request = axios.delete(`${PERSON_SERVICE}/${id}`)

    return request.then(response => {return response.status})   
}

export default {
    getAllPeople,
    createPerson,
    updatePerson,
    deletePerson
}