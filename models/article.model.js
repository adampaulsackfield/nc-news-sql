const db = require('../db/connection');
const User = require('./user.model');

exports.selectArticles = async (
	sort_by = 'created_at',
	order = 'DESC',
	topic,
	limit = 10,
	p = 1
) => {
	const allowedSortBy = ['article_id', 'created_at', 'votes', 'title'];
	const allowedOrderBy = ['DESC', 'desc', 'ASC', 'asc'];
	const allowedTopics = [];

	let topics = await db.query('SELECT DISTINCT topic FROM articles');
	topics.rows.forEach((topic) => allowedTopics.push(topic.topic));

	if (!allowedSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'invalid sort_by' });
	}

	if (!allowedOrderBy.includes(order)) {
		return Promise.reject({ status: 400, msg: 'invalid order_by' });
	}

	if (topic && !allowedTopics.includes(topic)) {
		return Promise.reject({ status: 404, msg: 'topic not found' });
	}

	const query = {
		text: 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.votes, articles.created_at, COUNT(articles.article_id)::INT AS comment_count FROM articles FULL JOIN comments ON articles.article_id = comments.article_id ',
		values: [],
	};

	if (topic) {
		query.text += `WHERE topic = $1 `;
		query.values.push(topic);
	}

	query.text += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order} `;

	query.text += `LIMIT ${limit} OFFSET ${limit * (p - 1)};`;

	const result = await db.query(query);

	if (!result.rows.length) {
		return Promise.reject({ status: 400, msg: 'Articles not found' });
	}

	return result.rows;
};

exports.selectArticleById = async (article_id) => {
	if (isNaN(parseInt(article_id))) {
		return Promise.reject({
			status: 400,
			msg: 'article_id must be an integar',
		});
	}

	const articlesQuery = {
		text: `SELECT * FROM articles WHERE articles.article_id = $1 ;`,
		values: [article_id],
	};

	const commentsQuery = {
		text: `SELECT * FROM comments WHERE comments.article_id = $1;`,
		values: [article_id],
	};

	let articles = db.query(articlesQuery);

	let comments = db.query(commentsQuery);

	const promises = [articles, comments];

	const result = await Promise.all(promises);

	if (!result[0].rows.length) {
		return Promise.reject({ msg: 'Article not found', status: 404 });
	}

	const article = {
		...result[0].rows[0],
		comment_count: result[1].rows.length,
	};

	return article;
};

exports.patchArticleById = async (article_id, inc_votes) => {
	if (isNaN(parseInt(article_id))) {
		return Promise.reject({
			status: 400,
			msg: 'article_id must be an integar',
		});
	}

	if (inc_votes === undefined) {
		return Promise.reject({ status: 400, msg: 'inc_votes is required' });
	}

	if (typeof inc_votes !== 'number') {
		return Promise.reject({ status: 400, msg: 'inc_votes must be an integar' });
	}

	const query = {
		text: `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
		values: [inc_votes, article_id],
	};

	const result = await db.query(query);

	if (!result.rows.length) {
		return Promise.reject({ msg: 'Article not found', status: 404 });
	}

	return result.rows[0];
};

exports.selectCommentsByArticleId = async (article_id) => {
	const query = {
		text: `SELECT * FROM comments WHERE comments.article_id = $1;`,
		values: [article_id],
	};

	const result = await db.query(query);

	if (!result.rows.length) {
		return Promise.reject({ msg: 'Comments not found', status: 404 });
	}
	return result.rows;
};

exports.postComment = async (article_id, reqBody) => {
	const { username, body } = reqBody;

	if (isNaN(parseInt(article_id))) {
		return Promise.reject({
			status: 400,
			msg: 'article_id must be an integar',
		});
	}

	if (Object.keys(reqBody).length === 0 && reqBody.constructor === Object) {
		return Promise.reject({ status: 400, msg: 'No body provided' });
	}

	if (!username || !body) {
		return Promise.reject({ status: 400, msg: 'Required fields missing' });
	}

	const validUsernames = await (
		await User.selectUsers()
	).map((e) => e.username);

	if (!validUsernames.includes(username)) {
		return Promise.reject({
			status: 404,
			msg: 'Author not found',
		});
	}

	const query = {
		text: 'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
		values: [article_id, username, body],
	};

	const result = await db.query(query);

	if (!result.rows.length) {
		return Promise.reject({ msg: 'Article not found', status: 404 });
	}

	return result.rows[0];
};

exports.postArticle = async (author, body, title, topic) => {
	if (!author || !body || !title || !topic) {
		return Promise.reject({ status: 400, msg: 'Required fields are missing' });
	}

	if (
		typeof author !== 'string' ||
		typeof body !== 'string' ||
		typeof title !== 'string' ||
		typeof topic !== 'string'
	) {
		return Promise.reject({ status: 400, msg: 'Incorrect data types' });
	}

	const validUsernames = await (
		await User.selectUsers()
	).map((e) => e.username);

	if (!validUsernames.includes(author)) {
		return Promise.reject({
			status: 404,
			msg: 'Author not found',
		});
	}

	const query = {
		text: `INSERT INTO articles (author, body, title, topic) VALUES ($1, $2, $3, $4) RETURNING article_id`,
		values: [author, body, title, topic],
	};

	const result = await db.query(query);

	const article_id = result.rows[0].article_id;

	const article = await this.selectArticleById(article_id);

	return article;
};
