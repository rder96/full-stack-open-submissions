import React, { useState, useEffect } from 'react'
import personsService from './services/persons'

const Person = ( {person, deletePerson} ) => { 
  return (
      <>
        <div>{person.name} {person.number} <button onClick={deletePerson} value={person.id}>delete</button></div>
      </>
  )
}

const Filter = ( {text, newSearch, handleNewSearch} ) =>
    <div>{text}<input value={newSearch} onChange={handleNewSearch} /></div>

const Persons = ( {persons, newSearch, deletePerson} ) => { 
  if (newSearch === "") {
    return persons.map(x => <Person key={x.name} person={x} deletePerson={deletePerson}/>)
  }
  return persons.filter(x => x.name.toLowerCase().startsWith(newSearch.toLowerCase())).map(x => 
    <Person key={x.name} person={x} deletePerson={deletePerson} /> 
  )
}

const PersonForm = ( {addNewPerson, newName, newNumber, handleNameChange, handleNumberChange} ) => { 
  return (
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )  
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')

  const handleNameChange = (event) =>
    setNewName(event.target.value)
  
  const handleNumberChange = (event) => 
    setNewNumber(event.target.value)

  const handleNewSearch = (event) => 
    setNewSearch(event.target.value)   

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.map(x => x.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(x => x.name === newName).id
        personsService 
          .update(personId, {name: newName, number: newNumber})
          .then(response => {
            setPersons(persons.map(x => x.id !== response.id ? x : response))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => console.log(error))
      }
      setNewName('')
      setNewNumber('')
    } else {
        personsService
          .create({ name: newName, number: newNumber })
          .then(response => {
            setPersons(persons.concat(response)) 
            setNewName('')
            setNewNumber('')
          })
          .catch(error => console.log(error))
    }
  }

  const deletePerson = (event) => { 
    event.preventDefault()
    const id = event.target.value
    const personName = persons.find(x => x.id.toString() === id).name
    if (window.confirm(`Delete ${personName} ?`)) { 
      personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(x => x.id.toString() !== id))
      }) 
    }
  }

  useEffect(() => {
    personsService
      .getAll()
      .then(response => setPersons(response))
  }, [])
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text="filter shown with" newSearch={newSearch} handleNewSearch={handleNewSearch} />
      <h3>add a new</h3>
      <PersonForm 
        newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addNewPerson={addNewPerson} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons} newSearch={newSearch} deletePerson={deletePerson}/>
    </div>
  )
}

export default App