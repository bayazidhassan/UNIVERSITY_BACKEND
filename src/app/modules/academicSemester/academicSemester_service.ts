import { codeMapper } from './academicSemester_constant';
import { TAcademicSemester } from './academicSemester_interface';
import { AcademicSemester } from './academicSemester_schema_model';

const createAcademicSemesterIntoDB = async (
  academicSemesterData: TAcademicSemester,
) => {
  /*
  //I implement this logic by using mongoose pre hook/middleware
  const existed = await AcademicSemester.findOne({
    semesterName: academicSemesterData.semesterName,
    year: academicSemesterData.year,
  });
  if (existed) {
    throw new Error(
      `You have already created this semester: ${academicSemesterData.semesterName}, ${academicSemesterData.year}`,
    );
  }
  */

  //for matching code with semester name
  if (
    codeMapper[academicSemesterData.semesterName] !== academicSemesterData.code
  ) {
    throw new Error('Invalid semester code.');
  }

  const result = AcademicSemester.create(academicSemesterData);
  if (!result) {
    throw new Error('Failed to create academic semester.');
  }
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  if (result.length === 0) {
    throw new Error('Academic semesters are not found.');
  }
  return result;
};

const getAnAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  if (!result) {
    throw new Error('Academic semester is not found.');
  }
  return result;
};

const updateAnAcademicSemesterIntoDB = async (
  id: string,
  academicSemesterData: Partial<TAcademicSemester>,
) => {
  /*
  //for matching code with semester name
  if (
    codeMapper[academicSemesterData.semesterName] !== academicSemesterData.code //Type 'undefined' cannot be used as an index type.
  ) {
    throw new Error('Invalid semester code.');
  }
  */

  //for matching code with semester name
  //to solve this  error: Type 'undefined' cannot be used as an index type.
  const existing = await AcademicSemester.findById(id);
  if (!existing) {
    throw new Error('Academic semester is not found.');
  }
  const semesterNameAfter =
    academicSemesterData.semesterName ?? existing.semesterName; //nullish coalescing operator ??
  const codeAfter = academicSemesterData.code ?? existing.code; //nullish coalescing operator ??

  //for matching code with semester name
  if (codeMapper[semesterNameAfter] !== codeAfter) {
    throw new Error('Invalid semester code.');
  }

  const existed = await AcademicSemester.findOne({
    semesterName: academicSemesterData.semesterName ?? existing.semesterName,
    year: academicSemesterData.year ?? existing.year,
  });
  if (existed) {
    throw new Error(
      //if semester name or year is not given then use the existed value
      `You have already created this semester: ${academicSemesterData.semesterName ?? existing.semesterName}, ${academicSemesterData.year ?? existing.year}`,
    );
  }

  const result = await AcademicSemester.findByIdAndUpdate(
    id,
    academicSemesterData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!result) {
    throw new Error('Academic semester is not found.');
  }
  return result;
};

export const academicSemesterService = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getAnAcademicSemesterFromDB,
  updateAnAcademicSemesterIntoDB,
};
