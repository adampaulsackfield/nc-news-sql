const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

describe('USERS', () => {
	describe('GET /api/users', () => {
		const ENDPOINT = '/api/users';

		it('should return an array of users', () => {
			return request(app)
				.get(ENDPOINT)
				.expect(200)
				.then((res) => {
					expect(res.body.users).toBeInstanceOf(Array);
					expect(res.body.users[0]).toMatchObject({
						username: expect.any(String),
					});
				});
		});
	});
});
