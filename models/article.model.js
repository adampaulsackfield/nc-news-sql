const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	let articles = db.query(
		`SELECT * FROM articles WHERE articles.article_id = ${article_id} ;`
	);
	let comments = db.query(
		`SELECT * FROM comments WHERE comments.article_id = ${article_id};`
	);
	const promises = [articles, comments];

	return Promise.all(promises).then((result) => {
		if (!result[0].rows.length) {
			return Promise.reject({ msg: 'Article not found', status: 404 });
		}

		const article = {
			...result[0].rows[0],
			comment_count: result[1].rows.length,
		};

		return article;
	});
};

exports.patchArticleById = (article_id, inc_votes) => {
	return db
		.query(
			`UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = ${article_id} RETURNING *;`
		)
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return result.rows[0];
		});
};
