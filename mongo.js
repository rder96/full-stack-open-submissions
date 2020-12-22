const mongoose = require('mongoose') 

// not needed in actual app
if (!(process.argv.length == 3 || process.argv.length == 5)) {
  console.log("Wrong number of input given");
  process.exit(1);
} 

const password = process.argv[2] 
const personName = process.argv[3] || ""
const personNumber = process.argv[4] || ""

const url = 
 `mongodb+srv://fullstack:${password}@cluster0.q3pgu.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String, 
  number: String,
}) 

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: personName, 
  number: personNumber,
})

if (process.argv.length == 5) {
  person.save().then(result => { 
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  }) 
}

if (process.argv.length == 3) { 
  Person.find({}).then(result => {
    console.log(`phonebook:`);
    result.forEach(person => {
     console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}

