const express = require('express');

const app = express();

const { getUsers } = require('./controllers/user.controller');
const {
	updateArticleById,
	getArticleById,
	getArticles,
	getCommentsByArticleId,
} = require('./controllers/article.controller');
const { getTopics } = require('./controllers/topic.controller');

app.use(express.json());

app.get('/api/users', getUsers);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', updateArticleById);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

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
