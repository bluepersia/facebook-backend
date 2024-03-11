import express from 'express';
const router = express.Router ();
import reactionRouter from './reactionRoutes';
import postController = require ('../controller/postController');
import authController = require ('../controller/authController');
import { setMine } from '../controller/factory';

router.use ('/:postId/reactions', reactionRouter);

router.use (authController.protect);

router.get ('/related-posts', postController.getRelatedPosts);

router.route ('/').get (postController.getAllPosts).post (postController.uploadImages, postController.processImages, setMine, postController.createPost);
router.route ('/:id').get (postController.getPost).patch (postController.updatePost).delete (postController.deletePost);


export default router;