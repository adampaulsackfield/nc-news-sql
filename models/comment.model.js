const db = require('../db/connection');

exports.deleteComment = (comment_id) => {
	if (isNaN(parseInt(comment_id))) {
		return Promise.reject({
			status: 400,
			msg: 'comment_id must be a number',
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

exports.patchCommentById = (comment_id, inc_votes) => {
	if (isNaN(parseInt(comment_id))) {
		return Promise.reject({
			status: 400,
			msg: 'comment_id must be a number',
		});
	}

	if (isNaN(parseInt(inc_votes)) || inc_votes === undefined) {
		return Promise.reject({
			status: 400,
			msg: 'inc_votes must be provided and should be a number',
		});
	}

	return db
		.query(
			`UPDATE comments SET votes = votes + ${inc_votes} WHERE comment_id = ${comment_id} RETURNING *`
		)
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({ msg: 'Comment not found', status: 404 });
			}
			return result.rows[0];
		});
};
