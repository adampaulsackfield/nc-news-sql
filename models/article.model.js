const db = require('../db/connection');

exports.selectArticles = async (
	sort_by = 'created_at',
	order = 'DESC',
	topic
) => {
	const allowedSortBy = ['article_id', 'created_at', 'votes', 'title'];
	const allowedTopics = [];

	let topics = await db.query('SELECT DISTINCT topic FROM articles');
	topics.rows.forEach((topic) => allowedTopics.push(topic.topic));

	if (!allowedSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'invalid sort_by' });
	}

	if (topic && !allowedTopics.includes(topic)) {
		return Promise.reject({ status: 400, msg: 'invalid topic' });
	}

	const query = {
		text: 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.votes, articles.created_at, COUNT(articles.article_id)::INT AS comment_count FROM articles FULL JOIN comments ON articles.article_id = comments.article_id ',
		values: [],
	};

	if (topic) {
		query.text += `WHERE topic = $1 `;
		query.values.push(topic);
	}

	query.text += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
	return db.query(query).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({ status: 400, msg: 'Articles not found' });
		}
		return result.rows;
	});
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
