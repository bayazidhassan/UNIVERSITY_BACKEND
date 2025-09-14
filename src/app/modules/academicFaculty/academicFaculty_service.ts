import { TAcademicFaculty } from './academicFaculty_interface';
import { AcademicFaculty } from './academicFaculty_schema_model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  if (!result) {
    throw new Error('Failed to create academic faculty.');
  }
  return result;
};

const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFaculty.find();
  if (result.length === 0) {
    throw new Error('Academic faculties are not found.');
  }
  return result;
};

const getAnAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  if (!result) {
    throw new Error('Academic faculty is not found.');
  }
  return result;
};

const updateAnAcademicFacultyIntoDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new Error('Academic faculty not found');
  }
  return result;
};

export const academicFacultyService = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getAnAcademicFacultyFromDB,
  updateAnAcademicFacultyIntoDB,
};
