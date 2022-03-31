const { getTopics } = require('../controllers/topic.controller');

const topicRouter = require('express').Router();

topicRouter.route('/').get(getTopics);

module.exports = topicRouter;
