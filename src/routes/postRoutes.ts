import express from 'express';
const router = express.Router ();
import postController = require ('../controller/postController');
import authController = require ('../controller/authController');

router.use (authController.protect);

router.get ('/related-posts', postController.getRelatedPosts);

router.route ('/').get (postController.getAllPosts).post (postController.uploadImages, postController.processImages, postController.createPost);
router.route ('/:id').get (postController.getPost).patch (postController.updatePost).delete (postController.deletePost);


export default router;