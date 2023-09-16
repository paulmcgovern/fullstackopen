import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Message from './components/Message'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import peopleService from './services/People'

import './index.css'


const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
   const [feedback, setFeedback] = useState({message: '', isError: false})


  const setTimedFeedback = (msg, isError=false) => {

    if(feedback && feedback.tid){
      clearTimeout(feedback.tid)
    }

    // Three second timout on message display.
    const tid = setTimeout(() => { setFeedback({message: '', isError: false})}, 3000)

    setFeedback({tid: tid, message: msg, isError: isError})
  }


  const handleForm = (event) => {

    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    // Name and number alread stored in list
    if(existingPerson && existingPerson.number === newNumber) {

      setTimedFeedback(`${newName} is already added to phonebook.`, true)
      return
    }

    // Name exists but number is different.
    if(existingPerson) {
      
      if(!window.confirm(`${newName} is already in the phonebook. Replace number with new one?`)) {
        return
      }

      const updatedPerson = {
        name: existingPerson.name,
        number: newNumber,
        id: existingPerson.id
      }
      
      peopleService.updatePerson(updatedPerson)
        .then(resPerson => {

          // Update number
          const updatedPeople = persons.map(person => {
            if(person.id == updatedPerson.id) {
              person.number = updatedPerson.number
            }
            return person
          })

          setPersons(updatedPeople)
          setTimedFeedback(`Added ${updatedPerson.name}`)

        }).catch((err)=> {

          console.error("Error during update", err)
          setTimedFeedback("Error during update.", true)

        }).finally(() => {

          // Clear form inputs
          setNewName("")
          setNewNumber("")
        })

      return  
    }


    const newPerson = {
      name: newName,
      number: newNumber
    }
  
    // Send the new person to the server.
    // Server will brovide an ID number for
    // the new record. Write the ID back to
    // the person record.
    peopleService.createPerson(newPerson)
      .then(resPerson => {

        newPerson.id = resPerson.id
        setPersons([...persons, newPerson])
        setTimedFeedback(`Added ${newPerson.name}`)

      }).catch((err)=> {

        console.error("Error during create", err)
        setTimedFeedback("Error during create", true)        

      }).finally(() => {

        // Clear form inputs
        setNewName("")
        setNewNumber("")
      })
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personHook = () => {
    peopleService.getAllPeople()
      .then(allPeople => setPersons(allPeople))
      .catch((err)=> {

        console.error("Error fetching list of people.", err)
        setTimedFeedback("Error fetching list of people.", true)
      })
  }

  // Send the deletion request to the
  // server and then update local list 
  // on success.
  const handleDeletePerson = (delPerson) => {
    peopleService.deletePerson(delPerson.id)
      .then(status => {
        const updatedList = persons.filter(person => person !== delPerson)
        setPersons(updatedList)
      })
      .catch((err) => {
        console.error("Error during deletion.", err)
        setTimedFeedback(`Information of ${delPerson.name} has already been removed from server`, true)
      })
  }

  // Load initial list of People
  useEffect(personHook, [])


  return (
    <div>

      <h2>Phonebook</h2>

      <Message message={feedback.message} isError={feedback.isError} />

      <Filter filter={filter} changeHandler={handleFilterChange} />
     
      <PersonForm submitHandler={handleForm}
                  newName={newName}
                  nameChangeHandler={handleNewNameChange}
                  newNumber={newNumber}
                  numberChangeHandler={handleNewNumberChange} />

      <h2>Numbers</h2>

      <PersonList personList={persons} filter={filter} handleDelete={handleDeletePerson} />

    </div>
  )
}

export default App
