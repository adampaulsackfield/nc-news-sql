const { removeComment } = require('../controllers/comment.controller');

const commentRouter = require('express').Router();

commentRouter.route('/:comment_id').delete(removeComment);

module.exports = commentRouter;
