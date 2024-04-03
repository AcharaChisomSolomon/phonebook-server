require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);


app.post('/api/persons', (req, res) => { 
    const body = req.body;
    if (!body.name || !body.number) {
        console.log('name or number missing');
        return res.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save().then((savedPerson) => {
        res.json(savedPerson);
    });

});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then((person) => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    });
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});
 
app.get('/info', (req, res) => { 
    const date = new Date();
    console.log('info returned');
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

app.delete('/api/persons/:id', (req, res) => { 
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    persons = persons.filter(person => person.id !== id);
    
    if (!person) {
        console.log('404');
        return res.status(404).end();
    }

    console.log('deletion successful');
    res.status(204).end();
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});