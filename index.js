const http = require('http');
const express = require('express');
const { res, json } = require('express');
const { brotliDecompress } = require('zlib');

const morgan = require('morgan');


morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const app = express();
app.use(express.json());


let persons = [
{
    name:"Arto Hellas",
    number: "040=123456",
    id:1
},
{
    name:"Dan Avramov",
    number: "39-44-5323523",
    id:2
},
{
    name:"Mary Poppendieck",
    number: "39-23-6423122",
    id:3
},
];
  

app.get('/', (req,res) =>{
    res.send('<h1>Hello World! </h1>');
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req,res) =>{
    if(persons.length === 0)
    {
        res.send(`<p> The phonebook is empty </p> <br> ${new Date()}`);
    }
    res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`);
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id)
    if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
}) 

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id!==id);

    res.status(204).end();
})


const idGenreator = () => {
    return Math.floor(Math.random()*(10000000 - 1000000) + 1000000);
}

app.post('/api/persons', (req, res) => {
    const person = req.body;

    if(!person.number){
        return res.status(400).json({
            error: 'no phone number submited'
        });
    }

    if(!person.name){
        return res.status(400).json({
            error: 'no name submited'
        });
    }

    if(persons.some(p => p.name == person.name)){
        return res.status(400).json({
            error: 'person already exist'
        });
    }

    person.id = idGenreator();

    persons = persons.concat(person);

    res.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);