const { deleteComment, patchCommentById } = require('../models/comment.model');

exports.removeComment = async (req, res, next) => {
	const { comment_id } = req.params;

	try {
		await deleteComment(comment_id);
		res.sendStatus(204);
	} catch (err) {
		next(err);
	}
};

exports.updateCommentById = async (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;

	try {
		const comment = await patchCommentById(comment_id, inc_votes);
		res.status(200).send({ comment });
	} catch (err) {
		next(err);
	}
};
