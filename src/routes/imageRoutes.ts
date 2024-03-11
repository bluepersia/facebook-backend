import express from 'express';
const router = express.Router ();
import reactionRouter from './reactionRoutes';

router.use ('/:imageId/reactions', reactionRouter);

export default router;