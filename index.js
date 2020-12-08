const express = require('express') 
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('data', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

persons = [
    { 
      id: 1, 
      name: 'Arto Hellas', 
      number: '040-123456'
    },
    { 
      id: 2, 
      name: 'Ada Lovelace', 
      number: '39-44-5323523'
    },
    { 
      id: 3, 
      name: 'Dan Abramov',
      number: '12-43-234345' 
    },
    { 
      id: 4, 
      name: 'Mary Poppendieck',
      number: '39-23-6423122'
    }
]

app.get('/', (request, response) => {
    response.send('hello world')
})

app.get('/info', (request, response) => { 
    const currTime = new Date() 
    const info = `<p>Phonebook has info for ${persons.length} people</p>${currTime}<div></div>`
    
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)

    response.status(204).end()
})

generateId = () => {
  return Math.floor(Math.random() * 10000)
} 

app.post('/api/persons', (request, response) => { 
    const body = request.body 
    if (!body.name) { 
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) { 
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`)
})

