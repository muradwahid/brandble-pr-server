import express from 'express';
import { FacultyController } from './faculty.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyZodValidation } from './faculty.validation';
const router = express.Router();
router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY, ENUM_USER_ROLE.STUDENT), FacultyController.getAllFromDb);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY), FacultyController.getDataById);
router.patch(
  '/:id',
  validateRequest(FacultyZodValidation.updateFaculty),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.updateIntoDb
);
router.delete('/:id', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), FacultyController.deleteFromDb);
router.post(
  '/create-faculty',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyZodValidation.createFaculty),
  FacultyController.insertIntoDb
);

router.post('/:id/assign-courses',validateRequest(FacultyZodValidation.courseFacultyAddRemove),auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),  FacultyController.assignCourses);
router.delete(
  '/:id/remove-courses',
  validateRequest(FacultyZodValidation.courseFacultyAddRemove),
  FacultyController.removeCourses
);

export const FacultyRoutes = router;