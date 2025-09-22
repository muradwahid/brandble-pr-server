import { NextFunction, Request, Response, Router } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { PublicationController } from './publication.controller';

const router = Router();

//auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
//   FileUploadHelper.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = UserValidation.createStudent.parse(JSON.parse(req.body.data));
//     return UserController.createStudent(req, res, next);
//   }

// router.post('/create', PublicationController.createPublication);
router.post('/create',FileUploadHelper.upload.single('file'), (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return PublicationController.createPublication(req, res,next)
} );
router.get('/all-publications', PublicationController.getAllPublications);
router.get('/:id', PublicationController.getPublicationById);
// router.patch('/:id', PublicationController.updatePublication);
router.patch('/:id', FileUploadHelper.upload.single('file'), (req:Request, res:Response,next:NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return PublicationController.updatePublication(req, res,next)
});
router.delete('/:id', PublicationController.deletePublication);

export const PublicationRoutes = router;