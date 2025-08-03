import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { courseFilterAbleFields } from './course.constant';
import { ICourseCreateData } from './course.interface';
import { CourseService } from './course.service';

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterAbleFields);
  const options = pick(req.query, paginationFields);
  const result = await CourseService.getAllFromDb(options, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});
const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CourseService.updateIntoDb(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await CourseService.insertIntoDb(data);
  sendResponse<ICourseCreateData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully!',
    data: result,
  });
});
const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});
const assignFaculties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseService.assignFaculties(id, req.body.faculties);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course faculty assigned successfully',
      data: result,
    });
});
const removeFaculties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body.faculties);
  const result = await CourseService.removeFaculties(id, req.body.faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculty deleted successfully',
    data: result,
  });
});
export const CourseController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
  assignFaculties,
  removeFaculties,
};
