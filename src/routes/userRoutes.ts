import express from 'express';
import authenticateUser from '../middleware/authentication';
// import authorizeUser from '../middleware/authorization';
export const router = express.Router();

import {
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUserSearchList,
} from '../Controllers/userController';

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/getUserSearchList').get(getUserSearchList);
router.route('/:id').get(getSingleUser);
