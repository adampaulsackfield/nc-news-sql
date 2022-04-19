const express = require('express');
const apiRouter = require('./routes/api.router');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
	res.status(404).send({ message: 'Path not found' });
});

app.use((err, req, res, next) => {
	const badReqCodes = ['23503'];
	if (badReqCodes.includes(err.code)) {
		res.status(400).send({ message: 'bad request' });
	} else {
		next(err);
	}
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
