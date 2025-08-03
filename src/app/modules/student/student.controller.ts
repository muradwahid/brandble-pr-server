import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { Student } from '@prisma/client';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { StudentService } from './student.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { StudentFilterAbleFields } from './student.constant';

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, StudentFilterAbleFields);
  const result = await StudentService.getAllFromDb(options, filters);
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully!',
    meta: result.meta,
    data: result.data,
  })

});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully!',
    data: result,
  })
})
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await StudentService.insertIntoDb(data);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully!',
    data: result,
  });
});
const updateIntoDb= catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await StudentService.updateIntoDb(id, data);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully!',
    data: result,
  });
})
const deleteFromDb=catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteFromDb(id);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully!',
    data: result,
  })
})
export const StudentController = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};
