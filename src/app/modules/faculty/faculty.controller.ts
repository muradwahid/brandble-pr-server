import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { FacultyService } from "./faculty.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { FacultyFilterAbleFields } from "./faculty.constant";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const filters= pick(req.query,FacultyFilterAbleFields);
  const result = await FacultyService.getAllFromDb(options,filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved successfully',
    data: result
  })
})
const getDataById=catchAsync(async (req:Request,res:Response) => {
  const {id} = req.params;
  const result = await FacultyService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty retrieved successfully',
    data: result
  })
})
const insertIntoDb = catchAsync(async (req:Request,res:Response) => {
  const data = req.body;
  const result = await FacultyService.insertIntoDb(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result
  })
})
const updateIntoDb=catchAsync(async (req:Request,res:Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await FacultyService.updateIntoDb(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully',
    data: result
  })
}) 
const deleteFromDb= catchAsync(async (req:Request,res:Response) => {
  const { id } = req.params;
  const result = await FacultyService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully',
    data: result
  })
})

const assignCourses=catchAsync(async (req:Request,res:Response) => {
  const {id} = req.params;
  const result = await FacultyService.assignCourses(id,req.body.courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course assigned successfully',
    data: result
  })
})
const removeCourses=catchAsync(async (req:Request,res:Response) => {
  const {id} = req.params;
  const result = await FacultyService.removeCourses(id,req.body.courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course removed successfully',
    data: result
  })
})
export const FacultyController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
  assignCourses,
  removeCourses,
};