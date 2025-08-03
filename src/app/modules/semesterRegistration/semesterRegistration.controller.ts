import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SemesterRegistrationSevice } from "./semesterRegistration.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { SemesterRegistrationFilterAbleFields } from "./semesterRegistration.constant";
import { paginationFields } from "../../../constants/pagination";
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, SemesterRegistrationFilterAbleFields);
  const options = pick(req.query, paginationFields);
  const result = await SemesterRegistrationSevice.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registrations retrieved successfully',
    meta:result.meta,
    data: result.data
  })
})
const insetIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationSevice.insetIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration created successfully',
    data: result
  })
})
const getDataById=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await SemesterRegistrationSevice.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration retrieved successfully',
    data: result
  })
})
const updateData=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;  
  const data = req.body;
  const result = await SemesterRegistrationSevice.updateData(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration updated successfully',
    data: result
  })
})
const deleteFromDb=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await SemesterRegistrationSevice.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registration deleted successfully',
    data: result
  })
})
export const SemesterRegistrationController = {
  insetIntoDb,
  getAllFromDb,
  getDataById,
  updateData,
  deleteFromDb,
}