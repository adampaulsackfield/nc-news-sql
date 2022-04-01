const db = require('../db/connection');

exports.selectUsers = async () => {
	const result = await db.query('SELECT username FROM users;');
	return result.rows;
};

exports.selectUserByUsername = async (username) => {
	const result = await db.query(
		`SELECT * FROM users WHERE users.username = '${username}';`
	);
	if (!result.rows.length) {
		return Promise.reject({ status: 404, msg: 'User does not exist' });
	}
	return result.rows[0];
};
