import express from 'express';
const router = express.Router ();
import reactionRouter from './reactionRoutes';
import imageController =  require ('../controller/imageController');

router.use ('/:imageId/reactions', reactionRouter);

router.get ('/:id', imageController.getImage);

export default router;