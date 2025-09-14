import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment_interface';
import { AcademicDepartment } from './academicDepartment_schema_model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  //I have also implemented this logic by using pre hook/middleware
  const isExisted = await AcademicDepartment.findOne({ name: payload.name });
  if (isExisted) {
    throw new Error(`${payload.name} is already existed.`);
  }

  const result = await AcademicDepartment.create(payload);
  if (!result) {
    throw new Error('Failed to create academic department.');
  }
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  //const result = await AcademicDepartment.find();
  const result = await AcademicDepartment.find().populate('academicFaculty');
  if (result.length === 0) {
    throw new Error('Academic department are not found.');
  }
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');

  if (!result) {
    throw new Error('Academic department is not found.');
  }
  return result;
};

const updateAnAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  //I have also implemented this logic by using query middleware/hook
  if (!result) {
    //throw new Error('Academic department is not found');
    throw new AppError(404, 'Academic department is not found.');
  }

  return result;
};

export const academicDepartmentService = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getAnAcademicDepartmentFromDB,
  updateAnAcademicDepartmentIntoDB,
};
