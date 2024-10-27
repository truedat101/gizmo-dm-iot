const express = require('express');
const router = express.Router();
const userService = require('./user.service');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users API for authentication
 */

// routes
/**
 * @swagger
 * /users/authenticate:
 *  post:
 *      description: Get all users. Not yet implemented.
 *      responses:
 *          200:
 *              description: Users of this application. Placeholder string for now.
 */
router.post('/authenticate', authenticate);

/**
 * @swagger
 * /users:
 *  get:
 *      description: Get all users. Not yet implemented.
 *      responses:
 *          200:
 *              description: Users of this application. Placeholder string for now.
 */
router.get('/', getAll);

module.exports = router;




function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
