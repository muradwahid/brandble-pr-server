import { NextFunction, Request, Response, Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import { PublicationController } from './publication.controller';

const router = Router();

//auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
//   FileUploadHelper.upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = UserValidation.createStudent.parse(JSON.parse(req.body.data));
//     return UserController.createStudent(req, res, next);
//   }

// router.post('/create', PublicationController.createPublication);
router.post('/create',
        // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        FileUploadHelper.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return PublicationController.createPublication(req, res,next)
});
router.get('/statistics', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), PublicationController.getPublicationStatistics)
router.get('/admin/searchpublications', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), PublicationController.getSearchPublications)
router.get('/admin/export-publications', PublicationController.exportPublicationsToExcel);

router.get('/all-publications',  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), PublicationController.getAllPublications);
router.get('/:id',
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), PublicationController.getPublicationById);

// router.patch('/:id', PublicationController.updatePublication);
router.patch('/:id',
        // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        FileUploadHelper.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return PublicationController.updatePublication(req, res,next)
});
router.delete('/:id',
        // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        PublicationController.deletePublication);

export const PublicationRoutes = router;