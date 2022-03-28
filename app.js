const express = require('express');

const app = express();

const { getUsers } = require('./controllers/user.controller');
const { getTopics } = require('./controllers/topic.controller');

app.use(express.json());

app.get('/api/users', getUsers);
app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
	res.status(404).send({ message: 'Path not found' });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ message: err.msg });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send({ message: 'Internal server error' });
});

module.exports = app;
