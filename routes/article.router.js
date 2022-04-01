const {
	getArticleById,
	updateArticleById,
	getArticles,
	getCommentsByArticleId,
	addComment,
	addArticle,
} = require('../controllers/article.controller');

const articleRouter = require('express').Router();

articleRouter.route('/').get(getArticles).post(addArticle);

articleRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(updateArticleById);

articleRouter
	.route('/:article_id/comments')
	.get(getCommentsByArticleId)
	.post(addComment);

module.exports = articleRouter;
