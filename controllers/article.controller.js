const {
	selectArticles,
	selectArticleById,
	patchArticleById,
	postComment,
} = require('../models/article.model');

exports.getArticles = (req, res, next) => {
	selectArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
};

exports.updateArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	if (inc_votes === undefined) {
		return next({ status: 400, msg: 'inc_votes is required' });
	}
	if (typeof inc_votes !== 'number') {
		return next({ status: 400, msg: 'inc_votes must be an integar' });
	}

	patchArticleById(article_id, inc_votes)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch((err) => next(err));
};

exports.addComment = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
		return next({ status: 400, msg: 'No body provided' });
	}

	if (!username || !body) {
		return next({ status: 400, msg: 'Required fields missing' });
	}

	postComment(article_id, { username, body })
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			if (err.code === '23503') {
				return next({ status: 404, msg: 'Article not found' });
			}
			next(err);
		});
};
