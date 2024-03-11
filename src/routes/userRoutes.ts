import express from 'express';
const router = express.Router ();
import authController = require ('../controller/authController');
import userController = require ('../controller/userController');
import multer from 'multer';
const upload = multer ();

router.post ('/sign-up', upload.none (), authController.signup);
router.post ('/login', upload.none (), authController.login);

router.post ('/forgot-password', upload.none(), authController.forgotPassword);
router.patch ('/reset-password/:token', upload.none(), authController.resetPassword);

router.use (authController.protect);

router.get ('/', userController.getAllUsers);

router.use (authController.restrictTo ('admin'));

router.post ('/', userController.createUser);
router.route ('/:id').get (userController.getUser).patch (userController.updateUser).delete (userController.deleteUser);

export default router;