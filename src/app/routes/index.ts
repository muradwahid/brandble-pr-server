import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoute } from '../modules/building/building.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { StudentRoutes } from '../modules/student/student.route';
import { RoomRoutes } from '../modules/room/room.route';
import { CourseRouter } from '../modules/course/course.route';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { OffredCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { OfferedCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSection.route';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    routes:AuthRoutes
  },
  // {
  //   path: '/academic-semesters',
  //   routes: AcademicSemesterRoutes,
  // },
  // {
  //   path: '/academic-faculty',
  //   routes: AcademicFacultyRoutes,
  // },
  // {
  //   path: '/academic-department',
  //   routes: AcademicDepartmentRoutes,
  // },
  // {
  //   path: '/students',
  //   routes: StudentRoutes,
  // },
  // {
  //   path: '/faculty',
  //   routes: FacultyRoutes,
  // },
  // {
  //   path: '/buildings',
  //   routes: BuildingRoute,
  // },
  // {
  //   path: '/rooms',
  //   routes: RoomRoutes,
  // },
  // {
  //   path: '/courses',
  //   routes:CourseRouter
  // },
  // {
  //   path: '/semester-registration',
  //   routes:SemesterRegistrationRoutes
  // },
  // {
  //   path: "/offered-courses",
  //   routes:OffredCourseRoutes
  // },
  // {
  //   path: "/offered-course-section",
  //   routes:OfferedCourseSectionRoutes
  // }
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
