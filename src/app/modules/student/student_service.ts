import status from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { updateDynamically } from '../../utils/updateDynamically';
import { User } from '../user/user_schema_model';
import { TStudent } from './student_interface';
import { Student } from './student_schema_model';

//const getAllStudentFromDB = async () => {
const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  /*
  const result = await Student.find();
  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Students are not found.');
  }
  return result;
  */

  /*
  //console.log(query) //[Object: null prototype] { email: 'bayazid1@gmail.com' }
  //In Express, req.query (and sometimes the object you get from it) is not a plain JavaScript object.
  //It’s created by querystring or URLSearchParams, which returns an object with no prototype (i.e., Object.create(null)).
  //So internally, it looks like this:
  //{
    //__proto__: null,
    //email: 'bayazid1@gmail.com'
  //}
  //That’s why Node prints:
  //[Object: null prototype] { email: 'bayazid1@gmail.com' }
  //It’s just letting you know it’s not a normal {} object with a prototype chain.
  

  const queryObj = { ...query }; //fixed the issue by spread operator
  //console.log(queryObj) //{ email: 'bayazid1@gmail.com' }

  //for partial search
  const studentSearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
    'guardian.name',
    'localGuardian.name',
  ];
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }
  //Implicitly returns object
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' }, // { email: { $regex: searchTerm, $options: 'i' } } //$options: 'i' (case insensitive)
    })),
  });
  //Explicitly returns object
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => {
      return { [field]: { $regex: searchTerm, $options: 'i' } }; // { email: { $regex: searchTerm, $options: 'i' } } //$options: 'i' (case insensitive)
    }),
  });

  //for filter
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  //for sorting
  let sort = 'createdAt';
  if (query?.sort) {
    sort = query.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);

  //for limiting and pagination
  let limit = 1;
  let page = 1;
  let skip = 0;
  if (query?.limit) {
    //limit = parseInt(query.limit as string); //parseInt() → requires string.
    limit = Number(query.limit); //Number() → can take any/unknown without complaint.
  }
  if (query?.page) {
    //page = parseInt(query.page as string); //parseInt() → requires string.
    page = Number(query.page); //Number() → can take any/unknown without complaint.
    skip = (page - 1) * limit;
  }
  let finalQuery = sortQuery;
  if (query?.page) {
    finalQuery = sortQuery.skip(skip).limit(limit);
  }

  //for limiting fields
  let fields = '-__v';
  if (query?.fields) {
    //fields = 'name,email' (before)
    fields = (query.fields as string).split(',').join(' ');
    //fields = 'name email' (after)
  }
  const fieldsLimitQuery = await finalQuery.select(fields);

  //if (fieldsLimitQuery.length === 0) {
  if (!fieldsLimitQuery.length) {
    throw new Error('Student not found.');
  }
  return fieldsLimitQuery;
  */

  const studentSearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
    'guardian.name',
    'localGuardian.name',
  ];

  //const studentQuery = new QueryBuilder<TStudent>(Student.find(), query);
  const studentQuery = new QueryBuilder<TStudent>(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  );

  studentQuery.search(studentSearchableFields).filter().sort();
  if (query?.page) {
    studentQuery.paginate();
  }
  studentQuery.fieldsLimiting();

  /*
  const result = await studentQuery.modelQuery
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  */

  const result = await studentQuery.modelQuery;

  const meta = await studentQuery.countTotal();

  //if (result.length === 0) {
  if (!result.length) {
    throw new AppError(status.NOT_FOUND, 'Students are not found');
  }

  return {
    meta,
    result,
  };
};

const getAStudentFromDB = async (id: string) => {
  /*
  const result = await Student.findOne({ id: id })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  if (!result) {
    throw new Error('Student not found.');
  }
  return result;
  */

  /*
  ->You can’t use .populate() directly after .aggregate() in Mongoose — that only works with find-type queries.
  ->When you run an aggregation, Mongoose gives you plain JavaScript objects, not full Mongoose documents, so populate() doesn’t automatically work unless you call it in a different way.
  ->Instead of chaining .populate() after aggregate(), you pass the aggregation result into Model.populate():
  */
  const result = await Student.aggregate([{ $match: { id: id } }]);
  const populatedResult = await Student.populate(result, [
    { path: 'user' },
    { path: 'admissionSemester' },
    {
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    },
  ]);
  if (populatedResult.length === 0) {
    throw new Error('Student is not found!');
  }
  return populatedResult;
};

const updateAStudentIntoDB = async (
  id: string,
  studentData: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } =
    studentData;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  /*
  If you pass remainingStudentData directly, then that object will be mutated with extra "prefix.key" entries.
  That may not be what you want, because remainingStudentData was created by destructuring from studentData.
  Mutating it makes it diverge from the original shape of studentData.
  That’s why creating a fresh modifiedStudentData copy is safer.
  If you don’t care about mutating remainingStudentData, you can pass it directly.
  If you want to keep remainingStudentData clean (same shape as original studentData), then using modifiedStudentData is the correct approach.
  */

  //non-primitive nested update without mutating
  /*
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }
  */
  if (name) {
    updateDynamically('name', name, modifiedStudentData);
  }
  if (guardian) {
    updateDynamically('guardian', guardian, modifiedStudentData);
  }
  if (localGuardian) {
    updateDynamically('localGuardian', localGuardian, modifiedStudentData);
  }

  //custom static method
  const existingUser = await Student.isStudentExists(id);
  if (!existingUser) {
    throw new AppError(400, 'Student is not found.');
  }

  //I have implemented query middleware/hook here to check before update
  const result = await Student.findOneAndUpdate(
    { id: id },
    //studentData,
    modifiedStudentData,
    { new: true, runValidators: true },
  );

  if (!result) {
    //throw new Error('Student is not found');
    throw new AppError(404, 'Student is not found.');
  }
  return result;
};

const deleteAStudentFromDB = async (id: string) => {
  /*
  const result = await Student.findOneAndDelete({ id: id });
  if (!result) {
    throw new Error('Student not found.');
  }
  return result;
  */

  //implement transaction here
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //transaction-1
    const deletedStudent = await Student.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete student.');
    }

    //transaction-2
    const deletedUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete user.');
    }

    //if transaction successful
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    //if transaction failed
    await session.abortTransaction();
    await session.endSession();
    //throw new AppError(status.BAD_REQUEST, 'Failed to delete student.');
    throw new Error(err);
  }
};

export const studentServices = {
  getAllStudentFromDB,
  getAStudentFromDB,
  updateAStudentIntoDB,
  deleteAStudentFromDB,
};
