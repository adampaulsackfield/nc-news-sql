const { deleteComment } = require('../models/comment.model');

exports.removeComment = (req, res, next) => {
	const { comment_id } = req.params;

	deleteComment(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((err) => next(err));
};
