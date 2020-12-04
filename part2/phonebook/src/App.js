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

const Notification = ({ msg }) => {
  const msgStyle = {
    color: 'green',  
    background: 'lightgrey', 
    fontSize: 20,
    borderStyle: 'solid', 
    borderRadius: 5,
    padding: 10, 
    marginBottom: 10,
    marginLeft: 5
  }

  if (msg === null) {
    return null
  } else {
    // it would be better not to handcode this and do success/failed 
    msg.startsWith('Changed') || msg.startsWith('Added') ? msgStyle.color = 'green' : msgStyle.color = 'red'
    return (
      <>
        <div style={msgStyle}>{msg}</div>
      </>
    )
  }

} 

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)

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
            setErrorMessage(`Changed ${newName}'s number`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setPersons(persons.filter(x => x.name !== newName))
           })
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
            setErrorMessage(`Added ${newName}`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
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
      .catch(error => {
        setErrorMessage(`Information of ${personName} has already been removed from the server`)
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
      <Notification msg={errorMessage} />
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