import express from 'express';
const router = express.Router ();
import postController = require ('../controller/postController');

router.route ('/').get (postController.getAllPosts).post (postController.createPost);
router.route ('/:id').get (postController.getPost).patch (postController.updatePost).delete (postController.deletePost);


export default router;