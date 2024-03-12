import express from 'express';
const router = express.Router ({mergeParams:true});
import reactionController = require ('../controller/reactionController');
import { setMine } from '../controller/factory';


router.get ('/', reactionController.getAllReactions);

router.post ('/toggle', reactionController.toggleLike);

export default router;