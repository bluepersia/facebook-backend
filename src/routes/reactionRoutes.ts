import express from 'express';
const router = express.Router ({mergeParams:true});
import reactionController = require ('../controller/reactionController');


router.get ('/', reactionController.getAllReactions);


export default router;