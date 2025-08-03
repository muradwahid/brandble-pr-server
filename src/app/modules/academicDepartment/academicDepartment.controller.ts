import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AcademicDepartment } from "@prisma/client";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { AcademicDepartmentService } from "./academicDepartment.service";
import { paginationFields } from "../../../constants/pagination";
import { AcademicDepartmentFilterAbleFields } from "./academicDepartment.constant";
import pick from "../../../shared/pick";


const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, AcademicDepartmentFilterAbleFields);
  const result = await AcademicDepartmentService.getAllFromDb(filters, options);
  sendResponse<AcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicDepartment retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})
const getDataById = catchAsync(async(req: Request, res: Response) => { 
  const { id } = req.params;
  const result = await AcademicDepartmentService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicDepartment retrieved successfully!",
    data: result,

  })
})
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AcademicDepartmentService.insertIntoDb(data);
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicDepartment created successfully!",
    data: result,
  });
})
const updateIntoDb=catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AcademicDepartmentService.updateIntoDb(id, data);
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicDepartment updated successfully!",
    data: result,
  })
}) 
const deleteFromDb=catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicDepartmentService.deleteFromDb(id);
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AcademicDepartment deleted successfully!",
    data: result,
  })
})
export const AcademicDepartmentController = {
  getAllFromDb,
  getDataById,
  insertIntoDb,
  updateIntoDb,
  deleteFromDb,
};