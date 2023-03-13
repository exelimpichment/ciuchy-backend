import express from 'express';

export const router = express.Router();

import { getSingleItem, getItems } from '../Controllers/itemController';

router.route('/').get(getItems);

router.route('/:Id').get(getSingleItem);
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
