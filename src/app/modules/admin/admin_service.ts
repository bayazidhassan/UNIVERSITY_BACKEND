import status from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { updateDynamically } from '../../utils/updateDynamically';
import { User } from '../user/user_schema_model';
import { TAdmin } from './admin_interface';
import { Admin } from './admin_schema_model';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  /*
  const result = await Admin.find();
  //if(result.length===0){
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Admins are not found.');
  }
  return result;
  */

  const adminSearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
  ];

  const adminQuery = new QueryBuilder(Admin.find(), query);
  adminQuery.search(adminSearchableFields).filter().sort();
  if (query?.page) {
    adminQuery.paginate();
  }
  adminQuery.fieldsLimiting();

  const result = await adminQuery.modelQuery;

  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Admins are not found.');
  }
  return result;
};

const getAnAdminFromDB = async (adminId: string) => {
  const result = await Admin.findOne({ id: adminId });
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Admin is not found.');
  }
  return result;
};

const updateAnAdminIntoDB = async (
  adminId: string,
  adminData: Partial<TAdmin>,
) => {
  const { name, ...remainingAdminData } = adminData;

  const modifiedAdminData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name) {
    updateDynamically('name', name, modifiedAdminData);
  }

  //static method
  const adminCheck = await Admin.isAdminExists(adminId);
  if (!adminCheck) {
    throw new AppError(status.NOT_FOUND, 'Admin is not found.');
  }

  //I have implemented query middleware/hook here to check before update
  const result = await Admin.findOneAndUpdate(
    { id: adminId },
    modifiedAdminData,
    { new: true, runValidators: true },
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Admin is not found.');
  }
  return result;
};

const deleteAnAdminFromDB = async (adminId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //transaction-1
    const deletedAdmin = await Admin.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(status.NOT_FOUND, 'Failed to delete admin.');
    }

    //transaction-2
    const deletedUser = await User.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(status.NOT_FOUND, 'Failed to delete user.');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const adminService = {
  getAllAdminsFromDB,
  getAnAdminFromDB,
  updateAnAdminIntoDB,
  deleteAnAdminFromDB,
};
