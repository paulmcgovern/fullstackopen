import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleForm = (event) => {

    event.preventDefault()

    if(persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook.`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }
  
    setPersons([...persons, newPerson])

    // Clear form inputs
    setNewName("")
    setNewNumber("")
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

  return (
    <div>

      <h2>Phonebook</h2>

      <Filter filter={filter} changeHandler={handleFilterChange} />
     
      <PersonForm submitHandler={handleForm}
                  newName={newName}
                  nameChangeHandler={handleNewNameChange}
                  newNumber={newNumber}
                  numberChangeHandler={handleNewNumberChange} />

      <h2>Numbers</h2>

      <PersonList personList={persons} filter={filter} />

    </div>
  )
}

export default App
