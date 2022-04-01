const fs = require('fs/promises');

exports.getEndpoints = async (req, res, next) => {
	const endpoints = await fs.readFile(`./endpoints.json`, 'utf-8');

	res.status(200).send({ endpoints });
};
