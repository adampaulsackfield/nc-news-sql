const request = require('supertest');
const app = require('../app');
const fs = require('fs/promises');

const ENDPOINT = '/api';

describe('ENDPOINT.JSON', () => {
	describe('GET /api', () => {
		it('should return a status of 200 and a JSON object for our endpoints', async () => {
			const expected = await fs.readFile(`./endpoints.json`, 'utf-8');

			return request(app)
				.get(`${ENDPOINT}`)
				.expect(200)
				.then((res) => {
					expect(res.body.endpoints).toBeInstanceOf(Object);
				});
		});
	});
});
