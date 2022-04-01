const { deleteComment, patchCommentById } = require('../models/comment.model');

exports.removeComment = (req, res, next) => {
	const { comment_id } = req.params;

	deleteComment(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((err) => next(err));
};

exports.updateCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;

	patchCommentById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch((err) => next(err));
};
