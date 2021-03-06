const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

const ENDPOINT = '/api/articles';

describe('ARTICLES', () => {
	describe('GET /api/articles/:article_id', () => {
		it('should return a 404 not found if the article_id does not exist', () => {
			return request(app)
				.get(`${ENDPOINT}/112358`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Article not found');
				});
		});

		it('should return a given article that matches the ID of the params', () => {
			return request(app)
				.get(`${ENDPOINT}/3`)
				.expect(200)
				.then((res) => {
					expect(res.body.article).toBeInstanceOf(Object);
					expect(res.body.article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
				});
		});

		it('should return comment_count when returning an article', () => {
			return request(app)
				.get(`${ENDPOINT}/3`)
				.expect(200)
				.then((res) => {
					expect(res.body.article).toBeInstanceOf(Object);
					expect(res.body.article.comment_count).toBe(2);
				});
		});

		it('should return a 404 not found if the article_id does not exist', () => {
			return request(app)
				.get(`/api/articles/112358`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Article not found');
				});
		});

		it("should return a 400 if the article_id isn't a number", () => {
			return request(app)
				.get(`${ENDPOINT}/abc`)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('article_id must be an integar');
				});
		});
	});

	describe('PATCH /api/articles/:article_id', () => {
		it('should return a 200 and the updated article if exists and valid data is passed', () => {
			return request(app)
				.patch(`${ENDPOINT}/3`)
				.send({ inc_votes: 3 })
				.expect(200)
				.then((res) => {
					expect(res.body.article).toBeInstanceOf(Object);
					expect(res.body.article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
					expect(res.body.article.votes).toBe(3);
				});
		});

		it('should return a 404 not found if the article_id does not exist', () => {
			return request(app)
				.patch(`${ENDPOINT}/112358`)
				.send({ inc_votes: 1 })
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Article not found');
				});
		});

		it('should return a 400 bad request if not given inc_votes', () => {
			return request(app)
				.patch(`${ENDPOINT}/3`)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('inc_votes is required');
				});
		});

		it('should return a 400 bad request if not given inc_votes as the correct data type', () => {
			return request(app)
				.patch(`${ENDPOINT}/4`)
				.send({ inc_votes: true })
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('inc_votes must be an integar');
				});
		});

		it("should return a 400 if the article_id isn't a number", () => {
			return request(app)
				.patch(`${ENDPOINT}/abc`)
				.send({ inc_votes: 4 })
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('article_id must be an integar');
				});
		});
	});

	describe('GET /api/articles', () => {
		it('should return an array of articles, with a comment count for each article', () => {
			return request(app)
				.get(`${ENDPOINT}`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeInstanceOf(Array);
					expect(res.body.articles[0]).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(Number),
					});
					expect(res.body.articles.length).toBe(10);
					expect(res.body.articles).toBeSortedBy('created_at', {
						descending: true,
					});
				});
		});

		it('should return a custom limit if provided a limit', () => {
			return request(app)
				.get(`${ENDPOINT}?limit=5`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeInstanceOf(Array);
					expect(res.body.articles[0]).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(Number),
					});
					expect(res.body.articles.length).toBe(5);
				});
		});

		it('should return a default sort_by = created_at in descending order', () => {
			return request(app)
				.get(`${ENDPOINT}`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeSortedBy('created_at', {
						descending: true,
					});
				});
		});

		it('should be able to add a custom sort_by', () => {
			return request(app)
				.get(`${ENDPOINT}?sort_by=votes`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeSortedBy('votes', { descending: true });
				});
		});

		it('should return a 400 bad request if not given inc_votes as the correct data type', () => {
			return request(app)
				.get(`${ENDPOINT}?sort_by=votes`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeSortedBy('votes', { descending: true });
				});
		});

		it('should be able to add a custom sort_by ASC or DESC', () => {
			return request(app)
				.get(`${ENDPOINT}?sort_by=votes&order=ASC`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeSortedBy('votes', {
						descending: false,
					});
				});
		});

		it('should be able to filter topics', () => {
			return request(app)
				.get(`${ENDPOINT}?topic=cats`)
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toBeInstanceOf(Array);
					expect(res.body.articles.length).toBe(1);
				});
		});

		it('should return a 404 if given a topic that does not exist', () => {
			return request(app)
				.get(`${ENDPOINT}?topic=dogs`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('topic not found');
				});
		});

		it('should return a 400 if given a order_by that is not allowed', () => {
			return request(app)
				.get(`${ENDPOINT}?order=dogs`)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('invalid order_by');
				});
		});
	});

	describe('POST /api/articles/:article_id/comments', () => {
		it('should return a 404 status when no article_id matches', () => {
			const comment = {
				body: 'What a great article',
				username: 'butter_bridge',
			};

			return request(app)
				.post(`${ENDPOINT}/22321312/comments`)
				.send(comment)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('bad request');
				});
		});

		it('should return a 400 status when no body is sent with the request', () => {
			return request(app)
				.post(`${ENDPOINT}/2/comments`)
				.send()
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('No body provided');
				});
		});

		it('should return a 404 status when the username does not exist', () => {
			const comment = {
				body: 'What a great article',
				username: 'not-real',
			};

			return request(app)
				.post(`${ENDPOINT}/2/comments`)
				.send(comment)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toEqual('Author not found');
				});
		});
	});

	describe('GET /api/articles/:article_id/comments', () => {
		it('should return a 200 with an array of comments for the given article_id', () => {
			return request(app)
				.get(`${ENDPOINT}/1/comments`)
				.expect(200)
				.then((res) => {
					expect(res.body.comments).toBeInstanceOf(Array);
					expect(res.body.comments[0]).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
					});
					expect(res.body.comments.length).toBe(11);
				});
		});

		it('should return a 404 not found if the article_id does not exist on any of the comments', () => {
			return request(app)
				.get(`${ENDPOINT}/112358/comments`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Comments not found');
				});
		});

		it('should return a 400 if the article_id is not a integar', () => {
			return request(app).get(`/api/articles/abc/comments`);
		});

		it("should return a 400 if the article_id isn't a number", () => {
			const comment = {
				body: 'What a great article',
				username: 'butter_bridge',
			};

			return request(app)
				.post(`${ENDPOINT}/abc/comments`)
				.send(comment)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('article_id must be an integar');
				});
		});

		it('should return a 400 status if any fields are missing from the body', () => {
			const comment = {
				body: 'What a great article',
			};
			return request(app)
				.post(`${ENDPOINT}/3/comments`)
				.send(comment)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('Required fields missing');
				});
		});

		it('should return a status of 201 and the new comment when successfully added', () => {
			const comment = {
				body: 'What a great article',
				username: 'butter_bridge',
			};
			return request(app)
				.post(`${ENDPOINT}/2/comments`)
				.send(comment)
				.expect(201)
				.then((res) => {
					expect(res.body.comment).toMatchObject({
						comment_id: expect.any(Number),
						body: comment.body,
						votes: 0,
						author: comment.username,
						article_id: 2,
						created_at: expect.any(String),
					});
				});
		});
	});

	describe('POST /api/articles', () => {
		it('should return a 201 status and the new article', () => {
			const input = {
				author: 'lurker',
				title: 'This is a new article',
				body: 'This is the body for that article',
				topic: 'cats',
			};
			const expected = {
				article_id: expect.any(Number),
				title: 'This is a new article',
				topic: 'cats',
				author: 'lurker',
				body: 'This is the body for that article',
				created_at: expect.any(String),
				votes: 0,
				comment_count: 0,
			};

			return request(app)
				.post(`${ENDPOINT}`)
				.send(input)
				.expect(201)
				.then((res) => {
					expect(res.body.article).toEqual(expected);
				});
		});

		it('should return a 400 status when not provided all required fields', () => {
			const input = {
				author: 'lurker',
				body: 'This is the body for that article',
				topic: 'cats',
			};

			return request(app)
				.post(`${ENDPOINT}`)
				.send(input)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toEqual('Required fields are missing');
				});
		});

		it('should return a 400 status when not provided all required fields with the correct datatypes', () => {
			const input = {
				author: 'lurker',
				title: 'This is a new article',
				body: 'This is the body for that article',
				topic: 6,
			};

			return request(app)
				.post(`${ENDPOINT}`)
				.send(input)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toEqual('Incorrect data types');
				});
		});

		it('should return a 404 status when the username does not exist', () => {
			const input = {
				author: 'noname',
				title: 'This is a new article',
				body: 'This is the body for that article',
				topic: 'cats',
			};

			return request(app)
				.post(`${ENDPOINT}`)
				.send(input)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toEqual('Author not found');
				});
		});
	});
});
