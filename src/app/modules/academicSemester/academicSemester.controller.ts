import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterfilterAbleFields } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, AcademicSemesterfilterAbleFields);
  const result = await AcademicSemesterService.getAllFromDb(filters, options);
  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AcademicSemesterService.getDataById(id);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester retrieved successfully!',
    data: result,
  });
});
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);
  const result = await AcademicSemesterService.insertIntoDb(data);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester created successfully!',
    data: result,
  });
});
const updateIntoDb=catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AcademicSemesterService.updateIntoDb(id, data);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester updated successfully!',
    data: result,
  })
})
const deleteFromDb=catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicSemesterService.deleteFromDb(id);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester deleted successfully!',
    data: result,
  })
})
export const AcademicSemesterController = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};
