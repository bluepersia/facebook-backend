import express from 'express';
const router = express.Router ({mergeParams:true});
import reactionController = require ('../controller/reactionController');
import authController = require ('../controller/authController');
import { setMine } from '../controller/factory';

router.use (authController.protect);

router.get ('/', reactionController.getAllReactions);

router.post ('/toggle', reactionController.toggleLike);

export default router;