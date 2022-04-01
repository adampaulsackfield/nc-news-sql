const {
	removeComment,
	updateCommentById,
} = require('../controllers/comment.controller');

const commentRouter = require('express').Router();

commentRouter
	.route('/:comment_id')
	.delete(removeComment)
	.patch(updateCommentById);

module.exports = commentRouter;
