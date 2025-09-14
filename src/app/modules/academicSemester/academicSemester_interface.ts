export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TCode = '01' | '02' | '03';

export type TAcademicSemester = {
  semesterName: TSemesterName;
  year: string;
  code: TCode;
  startMonth: TMonths;
  endMonth: TMonths;
};

export type TCodeMapper = {
  [key: string]: string;
};
