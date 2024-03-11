import express from 'express';
const router = express.Router ();
import friendshipController = require ('../controller/friendshipController');


router.post ('/add-friend/:id', friendshipController.addFriend);

router.get ('/my-friends', friendshipController.getMyFriends);

export default router;

