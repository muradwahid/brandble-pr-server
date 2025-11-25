import { Router,Request,Response,NextFunction } from "express";
import { AuthController } from "./auth.controller";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";

const router = Router();

router.get('/get-admin-role', AuthController.getAdminRole);
router.get('/all-users', AuthController.allUsers);
router.get('/user-all-info',AuthController.userAllInfo)
router.get('/:id', AuthController.getSingleUser);
router.post('/signup', AuthController.createUser);
router.get('/get-user-by-cookie', AuthController.getUserByCookie);
router.post('/signout', AuthController.getUserByCookie);
router.post('/signin', AuthController.loginUser);
router.patch('/update/:id', FileUploadHelper.upload.single('file'), (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return AuthController.updateUser(req, res,next)
});
router.delete('/:id', AuthController.deleteUser)
// router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;