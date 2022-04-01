const {
	selectArticles,
	selectArticleById,
	patchArticleById,
	selectCommentsByArticleId,
	postComment,
	postArticle,
} = require('../models/article.model');

exports.getArticles = async (req, res, next) => {
	const { sort_by, order, topic, limit, p } = req.query;

	try {
		const articles = await selectArticles(sort_by, order, topic, limit, p);
		res.status(200).send({ articles });
	} catch (err) {
		next(err);
	}
};

exports.getArticleById = async (req, res, next) => {
	const { article_id } = req.params;

	try {
		const article = await selectArticleById(article_id);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.updateArticleById = async (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;

	try {
		const article = await patchArticleById(article_id, inc_votes);
		res.status(200).send({ article });
	} catch (err) {
		next(err);
	}
};

exports.getCommentsByArticleId = async (req, res, next) => {
	const { article_id } = req.params;

	const parsedArticleId = parseInt(article_id);

	if (isNaN(parsedArticleId)) {
		return next({
			status: 400,
			msg: 'article_id must be an integar',
		});
	}

	try {
		const comments = await selectCommentsByArticleId(parsedArticleId);
		res.status(200).send({ comments });
	} catch (err) {
		next(err);
	}
};

exports.addComment = async (req, res, next) => {
	const { article_id } = req.params;
	const reqBody = req.body;

	try {
		const comment = await postComment(article_id, reqBody);
		res.status(201).send({ comment });
	} catch (err) {
		next(err);
	}
};

exports.addArticle = async (req, res, next) => {
	const { author, body, title, topic } = req.body;

	try {
		const article = await postArticle(author, body, title, topic);
		res.status(201).send({ article });
	} catch (err) {
		next(err);
	}
};
