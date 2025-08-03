import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AcademicFaculty } from "@prisma/client";
import httpStatus from "http-status";
import { AcademicFacultyService } from "./academicFaculty.service";
import { paginationFields } from "../../../constants/pagination";
import pick from "../../../shared/pick";
import { AcademicFacultyFilterableFields } from "./academicFaculty.constant";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  
  const options=pick(req.query,paginationFields)
  const filters = pick(req.query, AcademicFacultyFilterableFields);
  const result = await AcademicFacultyService.getAllFromDb(options, filters);
  sendResponse<AcademicFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty retrieved successfully!',
    meta:result.meta,
    data: result.data,
  })
})
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicFacultyService.getDataById(id);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty retrieved successfully!',
    data: result,
  });
});
const insertIntoDb=catchAsync(async(req:Request,res:Response)=>{
  const data = req.body;
  const result= await AcademicFacultyService.insertIntoDb(data);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty created successfully!',
    data: result,
  });
})
const updateIntoDb=catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const data = req.body;
  const result = await AcademicFacultyService.updateIntoDb(id, data);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty updated successfully!',
    data: result,
  });
})
const deleteFromDb=catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await AcademicFacultyService.deleteFromDb(id);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty deleted successfully!',
    data: result,
  })
})
export const AcademicFacultyController = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};