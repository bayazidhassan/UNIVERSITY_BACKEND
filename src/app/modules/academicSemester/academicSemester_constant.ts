import {
  TCode,
  TCodeMapper,
  TMonths,
  TSemesterName,
} from './academicSemester_interface';

export const months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const semesterName: TSemesterName[] = ['Autumn', 'Summer', 'Fall'];
export const code: TCode[] = ['01', '02', '03'];

export const codeMapper: TCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
