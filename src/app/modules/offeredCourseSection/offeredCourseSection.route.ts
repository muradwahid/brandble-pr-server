import express from 'express';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
const router = express.Router();
router.get("/:id", OfferedCourseSectionController.getDataById)
router.patch('/:id', OfferedCourseSectionController.updateFromDb);
router.delete('/:id', OfferedCourseSectionController.deleteFromDb);
router.post('/',OfferedCourseSectionController.inserIntoDb)
export const OfferedCourseSectionRoutes = router;