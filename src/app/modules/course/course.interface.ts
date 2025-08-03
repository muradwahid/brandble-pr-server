export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses?: IPrerequisiteCourseResponse[];
};
export type IPrerequisiteCourseResponse = {
  courseId: string;
  isDeleted?: null;
};
export type ICourseFilterResponse = {
  searchTerm?: string
  title?: string
  code?: string
  credits?: number
}