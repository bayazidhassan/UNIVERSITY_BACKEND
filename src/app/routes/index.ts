//import { Router } from 'express';
import express from 'express';
import { academicDepartmentRoute } from '../modules/academicDepartment/academicDepartment_route';
import { academicFacultyRoute } from '../modules/academicFaculty/academicFaculty_route';
import { academicSemesterRoute } from '../modules/academicSemester/academicSemester_route';
import { adminRoute } from '../modules/admin/admin_route';
import { authRoute } from '../modules/Auth/auth_route';
import { courseRoute } from '../modules/course/course_route';
import { enrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse_router';
import { facultyRoute } from '../modules/faculty/faculty_route';
import { offeredCourseRoute } from '../modules/offeredCourse/offeredCourse_route';
import { semesterRegistrationRoute } from '../modules/semesterRegistration/semesterRegistration_route';
import { studentRoutes } from '../modules/student/student_route';
import { userRoutes } from '../modules/user/user_route';

//const router = Router();
const router = express.Router();

/*
const moduleRoutes = [
  {
    path: '/student',
    route: academicFacultyRoute,
  },
  {
    path: '/user',
    route: academicFacultyRoute,
  },
  {
    path: '/academicSemester',
    route: academicFacultyRoute,
  },
  {
    path: '/academicFaculty',
    route: academicFacultyRoute,
  },
  {
    path: '/academicDepartment',
    route: academicDepartmentRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
*/

router.use('/student', studentRoutes);
router.use('/user', userRoutes);
router.use('/academicSemester', academicSemesterRoute);
router.use('/academicFaculty', academicFacultyRoute);
router.use('/academicDepartment', academicDepartmentRoute);
router.use('/faculty', facultyRoute);
router.use('/admin', adminRoute);
router.use('/course', courseRoute);
router.use('/semesterRegistration', semesterRegistrationRoute);
router.use('/offeredCourse', offeredCourseRoute);
router.use('/auth', authRoute);
router.use('/enrolledCourse', enrolledCourseRoutes);

export default router;
