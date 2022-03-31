const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');

afterAll(() => {
	return db.end();
});

beforeEach(() => seed(data));

const ENDPOINT = '/api/comments';

describe('COMMENTS', () => {
	describe('DELETE /api/comments/:comment_id', () => {
		it('should return a status of 204 when a comment has been deleted', () => {
			return request(app)
				.delete(`${ENDPOINT}/2`)
				.expect(204)
				.then((res) => {
					expect(res.statusCode).toBe(204);
				});
		});

		it('should return a 404 if the comment_id does not exist', () => {
			return request(app)
				.delete(`${ENDPOINT}/2245`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Comment not found');
				});
		});

		it("should return a 400 if the comment_id isn't a number", () => {
			return request(app)
				.delete(`${ENDPOINT}/abc`)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('comment_id must be an integar');
				});
		});
	});
});
