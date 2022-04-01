const apiRouter = require('express').Router();
const userRouter = require('./user.router');
const articleRouter = require('./article.router');
const commentRouter = require('./comment.router');
const topicRouter = require('./topic.router');

const { getEndpoints } = require('../controllers/endpoints.controller');

apiRouter.get('/', getEndpoints);

apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;
