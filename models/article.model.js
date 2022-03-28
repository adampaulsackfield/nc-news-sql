const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = ${article_id}`)
		.then((article) => {
			if (!article.rows.length) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return article.rows[0];
		});
};

exports.patchArticleById = (article_id, inc_votes) => {
	return db
		.query(
			`UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = ${article_id} RETURNING *`
		)
		.then((article) => {
			if (!article.rows.length) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return article.rows[0];
		});
};
