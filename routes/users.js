const userRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userProfilInfoSchema } = require('../middlewares/user-validation');
const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', celebrate({ body: userProfilInfoSchema }), updateUserInfo);

module.exports = userRouter;
