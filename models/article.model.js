const db = require('../db/connection');
var format = require('pg-format');
const res = require('express/lib/response');

exports.selectArticles = async () => {
	let articlesResult = await db.query(
		`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.votes, articles.created_at, COUNT(articles.article_id)::INT AS comment_count FROM articles FULL JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
	);

	return articlesResult.rows;
};

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

exports.postComment = (article_id, comment) => {
	const { username, body } = comment;

	return db
		.query(
			`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
			[article_id, username, body]
		)
		.then((result) => {
			if (!result.rows.length) {
				return Promise.reject({ msg: 'Article not found', status: 404 });
			}
			return result.rows[0];
		});
};
