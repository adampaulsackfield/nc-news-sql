const request = require('supertest');
const app = require('../app');
const fs = require('fs/promises');

describe('ENDPOINT.JSON', () => {
	describe('GET /api', () => {
		it('should return a status of 200 and a JSON object for our endpoints', async () => {
			const expected = await fs.readFile(`./endpoints.json`, 'utf-8');

			return request(app)
				.get('/api')
				.expect(200)
				.then((res) => {
					expect(res.body.endpoints).toEqual(expected);
				});
		});
	});
});
