import express from 'express';
const router = express.Router ();
import commentController = require ('../controller/commentController');
import authController = require ('../controller/authController');
import { setMine } from '../controller/factory';

router.use (authController.protect);

router.route ('/').get (commentController.getAllComments).post (setMine, commentController.setLevel, commentController.createComment);
router.route ('/:id').get (commentController.getComment).delete (commentController.deleteComment);

export default router;