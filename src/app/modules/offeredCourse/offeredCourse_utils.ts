import { TSchedule } from './offeredCourse_Interface';

export const checkTimeConflictForFaculty = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    //const newStartTime = new Date(`1970-01-01T${payload.startTime}:00`);
    //const newEndTime = new Date(`1970-01-01T${payload.endTime}:00`);
    //if (newStartTime < schedule.endTime && newEndTime > schedule.startTime) {

    //Lexicographical comparison
    if (
      newSchedule.startTime < schedule.endTime &&
      newSchedule.endTime > schedule.startTime
    ) {
      return true;
    }
  }
  return false;
};
