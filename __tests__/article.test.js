const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
require('jest-sorted');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

const ENDPOINT = '/api/articles';

describe('ARTICLES', () => {
	describe('GET /api/articles/:article_id', () => {
		it('should return a 404 not found if the article_id does not exist', () => {
			return request(app)
				.get(`/api/articles/112358`)
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
	});

	describe('PATCH /api/articles/:article_id', () => {
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

		it('should return a 201 and the updated article if exists and valid data is passed', () => {
			return request(app)
				.patch(`${ENDPOINT}/3`)
				.send({ inc_votes: 3 })
				.expect(201)
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
					expect(res.body.articles.length).toBe(12);
					expect(res.body.articles).toBeSortedBy('created_at', {
						descending: true,
					});
				});
		});

		it('should return a 400 bad request if not given inc_votes as the correct data type', () => {
			return request(app)
				.patch(`/api/articles/4`)
				.send({ inc_votes: true })
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('inc_votes must be an integar');
				});
		});

		it('should return a 201 and the updated article if exists and valid data is passed', () => {
			return request(app)
				.patch(`/api/articles/3`)
				.send({ inc_votes: 3 })
				.expect(201)
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
	});

	describe('POST /api/articles/:article_id/comments', () => {
		it('should return a 404 status when no article_id matches', () => {
			const comment = {
				body: 'What a great article',
				username: 'butter_bridge',
			};
			return request(app)
				.post('/api/articles/22321312/comments')
				.send(comment)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Article not found');
				});
		});

		it('should return a 400 status when no body is sent with the request', () => {
			return request(app)
				.post('/api/articles/2/comments')
				.send()
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('No body provided');
				});
		});

		it('should return a 400 status if any fields are missing from the body', () => {
			const comment = {
				body: 'What a great article',
			};
			return request(app)
				.post('/api/articles/3/comments')
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
				.post('/api/articles/2/comments')
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
});
