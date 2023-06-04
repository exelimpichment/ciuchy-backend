import express from 'express';
import authenticateUser from '../middleware/authentication';
export const router = express.Router();
import upload from '../utils/multer-config';
import {
  getSingleUser,
  showCurrentUser,
  updateProfileDetails,
  updateUserPassword,
  getUserList,
  getAllUsers,
} from '../Controllers/userController';

router
  .route('/updateProfileDetails')
  .patch(authenticateUser, upload.single('image'), updateProfileDetails);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/getUserList').get(getUserList);
router.route('/getAllUsers').get(getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/:id').get(getSingleUser);
