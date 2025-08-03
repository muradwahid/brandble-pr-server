import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OffredCourseValidations } from './offeredCourse.validation';
const router = express.Router();
router.get('/', OfferedCourseController.getAllFromDb);
router.get('/:id', OfferedCourseController.getDataById);
router.patch('/:id', OfferedCourseController.updateDataById);
router.patch("/:id",OfferedCourseController.deleteFromDb)
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OffredCourseValidations.create),
  OfferedCourseController.inserIntoDb
);

export const OffredCourseRoutes = router;
