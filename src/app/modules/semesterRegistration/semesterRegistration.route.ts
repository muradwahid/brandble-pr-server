import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationZodValidation } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();
router.get('/',SemesterRegistrationController.getAllFromDb);
router.get('/:id', SemesterRegistrationController.getDataById);
router.patch('/:id',auth(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),validateRequest(SemesterRegistrationZodValidation.updateSemesterRegistration), SemesterRegistrationController.updateData);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteFromDb
);
router.post('/',auth(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),validateRequest(SemesterRegistrationZodValidation.createSemesterRegistration), SemesterRegistrationController.insetIntoDb);


export const SemesterRegistrationRoutes = router;
