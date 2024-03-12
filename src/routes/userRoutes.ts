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

router.patch ('/update-password', upload.none(), authController.updatePassword);
router.patch ('/update-me', userController.uploadCover, userController.uploadProfile, userController.processImages, userController.updateMe);

router.delete ('/delete-me', userController.deleteMe);


router.get ('/', userController.getAllUsers);
router.get ('/:id', userController.getUser);

router.use (authController.restrictTo ('admin'));

router.post ('/', userController.createUser);
router.route ('/:id').patch (userController.updateUser).delete (userController.deleteUser);

export default router;