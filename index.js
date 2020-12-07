const express = require('express');
// reqiure('dotenv').config();
const cors = require('cors');

const logger = (req, res, next) => {
	console.log(`Method: ${req.method}`);
	console.log(`Path: ${req.path}`);
	console.log(`Body: ${req.body}`);
	console.log('---');
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint.' });
};

let contacts = [
	{
		name: 'Danai',
		number: '00306977018378',
		id: 1,
	},
	{
		name: 'Evan',
		number: '00306945653854',
		id: 2,
	},
	{
		name: 'Alex',
		number: '00306584859564',
		id: 3,
	},
];

const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
// app.use(logger);

app.get('/', (req, res) => res.send('You hit the root url.'));

app.get('/info', (req, res) =>
	res.send(
		`<p>Phonebook has info for ${contacts.length} people.</p>
  <p>${new Date()}</p>
  `
	)
);

app.get('/api/contacts', (req, res) => {
	res.json(contacts);
});

app.get('/api/contacts/:id', (req, res) => {
	const id = Number(req.params.id);
	const contact = contacts.find((contact) => contact.id === id);

	contact
		? res.status(200).json(contact)
		: res.status(404).end('Resource not found.');
});

app.post('/api/contacts', (req, res) => {
	if (!req.body.name || !req.body.number) {
		return res
			.status(404)
			.end('You must provide both a name and a number for a new contact.');
	}

	if (contacts.find((contact) => contact.name === req.body.name)) {
		return res
			.status(400)
			.end(`Error: Contact with name ${req.body.name} already exists.`);
	}

	const id = Math.floor(Math.random() * 10000);
	const newContact = {
		name: req.body.name,
		number: req.body.number,
		id,
	};

	contacts = contacts.concat(newContact);
	res.json(contacts);
});

app.delete('/api/contacts/:id', (req, res) => {
	const id = Number(req.params.id);
	contact = contacts.find((contact) => contact.id === id);

	if (contact) {
		contacts = contacts.filter((contact) => contact.id !== id);
		res.status(200).json(contacts);
	} else {
		res.status(404).end(`Error: Contact with id ${id} not found.`);
	}
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
