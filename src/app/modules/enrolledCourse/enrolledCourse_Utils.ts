export const calculateGradeAndPoints = (total_Marks: number) => {
  const result = {
    grade: 'NA',
    gradePoints: 0,
  };
  if (total_Marks >= 0 && total_Marks < 40) {
    result.grade = 'F';
    result.gradePoints = 0;
  } else if (total_Marks >= 40 && total_Marks < 50) {
    result.grade = 'E';
    result.gradePoints = 1;
  } else if (total_Marks >= 50 && total_Marks < 60) {
    result.grade = 'D';
    result.gradePoints = 2;
  } else if (total_Marks >= 60 && total_Marks < 70) {
    result.grade = 'C';
    result.gradePoints = 2.5;
  } else if (total_Marks >= 70 && total_Marks < 75) {
    result.grade = 'B';
    result.gradePoints = 3;
  } else if (total_Marks >= 75 && total_Marks < 80) {
    result.grade = 'A';
    result.gradePoints = 3.5;
  } else {
    result.grade = 'A+';
    result.gradePoints = 4;
  }
  return result;
};
