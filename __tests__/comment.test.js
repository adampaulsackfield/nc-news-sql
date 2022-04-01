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
					expect(res.body.message).toBe('comment_id must be a number');
				});
		});
	});

	describe('PATCH /api/comments/:comment_id', () => {
		it('should return a 200 with the updated comment, which includes the new votes total if the vote is incremented', () => {
			const expected = {
				article_id: 1,
				author: 'butter_bridge',
				body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				comment_id: 2,
				created_at: '2020-10-31T03:03:00.000Z',
				votes: 16,
			};

			return request(app)
				.patch(`${ENDPOINT}/2`)
				.send({ inc_votes: 2 })
				.expect(200)
				.then((res) => {
					expect(res.body.comment).toEqual(expected);
					expect(res.body.comment.votes).toBe(16);
				});
		});

		it('should return a 200 with the updated comment, which includes the new votes total if the vote is decremented', () => {
			const expected = {
				article_id: 1,
				author: 'butter_bridge',
				body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				comment_id: 2,
				created_at: '2020-10-31T03:03:00.000Z',
				votes: 12,
			};

			return request(app)
				.patch(`${ENDPOINT}/2`)
				.send({ inc_votes: -2 })
				.expect(200)
				.then((res) => {
					expect(res.body.comment).toEqual(expected);
					expect(res.body.comment.votes).toBe(12);
				});
		});

		it('should return a 404 if the comment_id does not exist', () => {
			return request(app)
				.patch(`${ENDPOINT}/223`)
				.send({ inc_votes: 2 })
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Comment not found');
				});
		});

		it("should return a 400 if the inc_votes isn't provied", () => {
			return request(app)
				.patch(`${ENDPOINT}/2`)
				.send()
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe(
						'inc_votes must be provided and should be a number'
					);
				});
		});

		it('should return a 400 if the inc_votes is the incorrec data type', () => {
			return request(app)
				.patch(`${ENDPOINT}/2`)
				.send({ inc_votes: true })
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe(
						'inc_votes must be provided and should be a number'
					);
				});
		});

		it('should return a 400 if the comment_id is the incorrect data type', () => {
			return request(app)
				.patch(`${ENDPOINT}/abc`)
				.send({ inc_votes: 2 })
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe('comment_id must be a number');
				});
		});
	});
});
