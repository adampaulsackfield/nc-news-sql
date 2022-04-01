const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

const ENDPOINT = '/api/users';

describe('USERS', () => {
	describe('GET /api/users', () => {
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

	describe('GET /api/users/:username', () => {
		it('should return a user object if given a username that exists', () => {
			const expected = {
				username: 'lurker',
				name: 'do_nothing',
				avatar_url:
					'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
			};

			return request(app)
				.get(`${ENDPOINT}/lurker`)
				.expect(200)
				.then((res) => {
					expect(res.body.user).toEqual(expected);
				});
		});

		it('should return a 404 status when the username does not exist', () => {
			return request(app)
				.get(`${ENDPOINT}/iDoNotExist`) // this also works for numbers
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('User does not exist');
				});
		});
	});
});
