const { getUsers } = require('../controllers/user.controller');

const userRouter = require('express').Router();

userRouter.route('/').get(getUsers);

module.exports = userRouter;
