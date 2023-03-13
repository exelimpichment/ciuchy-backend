import express from 'express';

export const router = express.Router();

import {
  getSingleUsers,
  showCurrentUser,
  updateUser,
  updateUsersPassword,
} from '../Controllers/userController';

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').post(updateUser);
router.route('/updateUsersPassword').post(updateUsersPassword);

router.route('/:Id').get(getSingleUsers);
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
