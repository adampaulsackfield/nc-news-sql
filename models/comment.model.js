const db = require('../db/connection');

exports.deleteComment = async (comment_id) => {
	if (isNaN(parseInt(comment_id))) {
		return Promise.reject({
			status: 400,
			msg: 'comment_id must be a number',
		});
	}

	const query = {
		text: 'DELETE FROM comments WHERE comment_id = $1;',
		values: [comment_id],
	};

	const result = await db.query(query);

	if (result.rowCount === 0) {
		return Promise.reject({ status: 404, msg: 'Comment not found' });
	}

	return;
};

exports.patchCommentById = async (comment_id, inc_votes) => {
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

	const query = {
		text: 'UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;',
		values: [inc_votes, comment_id],
	};

	const result = await db.query(query);

	if (!result.rows.length) {
		return Promise.reject({ msg: 'Comment not found', status: 404 });
	}

	return result.rows[0];
};
