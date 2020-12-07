const {Router} = require('express');

const {usersController} = require("../../controllers");
const {checkEmailAvailability} = require('./../../middlewares')

const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:email', usersController.getUserByEmail);
usersRouter.put('/', checkEmailAvailability, usersController.updateUser);
usersRouter.delete('/', usersController.deleteUser);

module.exports = usersRouter;
