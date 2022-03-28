const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

describe('ARTICLES', () => {
	describe('GET /api/articles/:article_id', () => {
		const ENDPOINT = '/api/articles/';

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
				.get(`/api/articles/2`)
				.expect(200)
				.then((res) => {
					const expected = {
						article_id: 2,
						title: 'Sony Vaio; or, The Laptop',
						topic: 'mitch',
						author: 'icellusedkars',
						body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
						created_at: '2020-10-16T05:03:00.000Z',
						votes: 0,
					};
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
					expect(res.body.article).toEqual(expected);
				});
		});
	});

	describe.only('PATCH /api/articles/:article_id', () => {
		const ENDPOINT = '/api/articles/';

		it('should return a 404 not found if the article_id does not exist', () => {
			return request(app)
				.patch(`/api/articles/112358`)
				.send({ inc_votes: 1 })
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Article not found');
				});
		});

		it('should return a 400 bad request if not given inc_votes', () => {
			return request(app)
				.patch(`/api/articles/3`)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('inc_votes is required');
				});
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
