const db = require('../db/connection');

exports.deleteComment = async (comment_id) => {
	if (isNaN(parseInt(comment_id))) {
		return Promise.reject({
			status: 400,
			msg: 'comment_id must be an integar',
		});
	}

	let result = await db.query(
		`SELECT * FROM comments WHERE comment_id = ${comment_id}`
	);

	if (!result.rows.length) {
		return Promise.reject({ status: 404, msg: 'Comment not found' });
	}
	return db
		.query(`DELETE FROM comments WHERE comment_id = ${comment_id}`)
		.then((arg) => {
			return;
		});
};
