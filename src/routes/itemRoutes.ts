import express from 'express';
export const router = express.Router();
import { addItem, getSingleItem } from '../Controllers/itemController';

import upload from '../utils/multer-config';

router.route('/addItem').post(upload.array('file', 5), addItem);

router.route('/:_id').get(getSingleItem);
