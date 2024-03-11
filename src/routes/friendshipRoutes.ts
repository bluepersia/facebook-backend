import express from 'express';
const router = express.Router ();
import friendshipController = require ('../controller/friendshipController');


router.post ('/add-friend/:id', friendshipController.addFriend);


export default router;

