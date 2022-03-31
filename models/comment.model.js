const db = require('../db/connection');

exports.deleteComment = async (comment_id) => {
	if (isNaN(parseInt(comment_id))) {
		return Promise.reject({
			status: 400,
			msg: 'comment_id must be an integar',
		});
	}

	return db
		.query(`DELETE FROM comments WHERE comment_id = ${comment_id}`)
		.then((result) => {
			if (result.rowCount === 0) {
				return Promise.reject({ status: 404, msg: 'Comment not found' });
			}
			return;
		});
};
