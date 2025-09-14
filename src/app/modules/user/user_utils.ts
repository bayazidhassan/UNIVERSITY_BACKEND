import { TAcademicSemester } from '../academicSemester/academicSemester_interface';
import { User } from './user_schema_model';

//for student
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean(); // returns a plain JavaScript object (lighter)

  /*
  The ?. (optional chaining) operator checks if lastStudent is null or undefined.
  If it is null/undefined, the whole expression short-circuits and returns undefined instead of throwing an error.
  So no runtime error will happen because of ?. , But you’ll just get undefined values.
  */
  const yearOfLastStudent = lastStudent?.id.substring(0, 4);
  const codeOfLastStudent = lastStudent?.id.substring(4, 6);
  const currentYear = payload.year;
  const currentCode = payload.code;

  if (
    lastStudent &&
    yearOfLastStudent === currentYear &&
    codeOfLastStudent === currentCode
  ) {
    currentId = lastStudent.id.substring(6);
  }
  const incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0');

  //const studentId = payload.year + payload.code + incrementId;
  const studentId = `${payload.year}${payload.code}${incrementId}`;
  return studentId;
};

//for faculty
export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  if (lastFaculty) {
    currentId = lastFaculty.id.substring(2);
  }
  const incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0');

  const facultyId = 'F-' + incrementId;
  //const facultyId = `F-${incrementId}`;

  return facultyId;
};

//for admin
export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  if (lastAdmin) {
    currentId = lastAdmin.id.substring(2);
  }
  const incrementId = (parseInt(currentId) + 1).toString().padStart(4, '0');

  const adminId = 'A-' + incrementId;
  //const facultyId = `A-${incrementId}`;

  return adminId;
};
