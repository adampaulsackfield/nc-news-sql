const db = require('../db/connection');

exports.selectUsers = () => {
	return db.query('SELECT username FROM users;').then((result) => {
		return result.rows;
	});
};

exports.selectUserByUsername = (username) => {
	return db
		.query(`SELECT * FROM users WHERE users.username = '${username}';`)
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({ status: 404, msg: 'User does not exist' });
			}
			return result.rows[0];
		});
};
