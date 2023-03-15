import express from 'express';
export const router = express.Router();
import authenticateUser from '../middleware/authentication';

import {
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUsersPassword,
  getUserSearchList,
} from '../Controllers/userController';

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUsersPassword').patch(updateUsersPassword);

router.route('/getUserSearchList').get(getUserSearchList);
router.route('/:id').get(authenticateUser, getSingleUser);
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
