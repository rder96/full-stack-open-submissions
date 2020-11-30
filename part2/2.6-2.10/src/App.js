import React, { useState } from 'react'

const Person = ( {name, number} ) => { 
  return (
      <>
        <div>{name} {number}</div>
      </>
  )
}

const Filter = ( {text, newSearch, handleNewSearch} ) =>
    <div>{text}<input value={newSearch} onChange={handleNewSearch} /></div>

const Persons = ( {persons, newSearch} ) => { 
  if (newSearch === "") {
    return persons.map(x => <Person key={x.name} name={x.name} number={x.number} />)
  }
  return persons.filter(x => x.name.toLowerCase().startsWith(newSearch.toLowerCase())).map(x => 
    <Person key={x.name} name={x.name} number={x.number} /> 
  )
}

const PersonForm = ( {addNewPerson, newName, handleNameChange, newNumber, handleNumberChange} ) => { 
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
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.map(x => x.name).includes(newName)) {
        alert(`${newName} is already added to phonebook`)
        setNewName('')
        setNewNumber('')
    } else {
        setPersons(persons.concat({ name: newName, number: newNumber })) 
        setNewName('')
        setNewNumber('')
    }
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value)
  
  const handleNumberChange = (event) => 
    setNewNumber(event.target.value)

  const handleNewSearch = (event) => 
    setNewSearch(event.target.value)   

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text="filter shown with" newSearch={newSearch} handleNewSearch={handleNewSearch} />
      <h3>add a new</h3>
      <PersonForm 
        newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addNewPerson={addNewPerson} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons} newSearch={newSearch} />
    </div>
  )
}

export default App