const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

const ENDPOINT = '/api/topics';

describe('TOPICS', () => {
	describe('GET /api/topics', () => {
		it('should return an array of topics', () => {
			return request(app)
				.get(ENDPOINT)
				.expect(200)
				.then((res) => {
					expect(res.body.topics).toBeInstanceOf(Array);
					expect(res.body.topics[0]).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
		});

		it('should return a 404 response for incorrect routes', () => {
			return request(app)
				.get(`${ENDPOINT}/nothing-here`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Path not found');
				});
		});
	});
});
