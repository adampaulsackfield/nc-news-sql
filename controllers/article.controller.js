const {
	selectArticles,
	selectArticleById,
	patchArticleById,
	selectCommentsByArticleId,
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

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => next(err));
};
