import { NextFunction, Request, Response, Router } from "express";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.get('/get-admin-role', AuthController.getAdminRole);
router.get('/all-users', AuthController.allUsers);
router.get('/user-all-info',AuthController.userAllInfo)
router.get('/:id', AuthController.getSingleUser);
router.post('/signup', AuthController.createUser);
router.patch('/send-email-otp', AuthController.sendEmailOTP);
router.patch('/check-otp', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), AuthController.verifyOTP);
router.patch('/update-password', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), AuthController.resetPassword);
router.get('/get-user-by-cookie', AuthController.getUserByCookie);
router.post('/signout', AuthController.getUserByCookie);
router.post('/signin', AuthController.loginUser);

router.patch('/update/:id', FileUploadHelper.upload.single('file'), (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return AuthController.updateUser(req, res,next)
});

router.delete('/delete/:id', AuthController.deleteUser)

// router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;