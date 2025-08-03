import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OfferedCourseService } from "./offeredCourse.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { offeredCourseFilterableFields } from "./offeredCourse.constant";


const getAllFromDb = catchAsync(async (req:Request,res:Response) => {
    const options = pick(req.query, paginationFields);
  const filters = pick(req.query, offeredCourseFilterableFields);
  const result =await OfferedCourseService.getAllFromDb(options,filters)
})

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course retrived successfully!",
    data:result
  })
 })

const inserIntoDb=catchAsync(async (req:Request,res:Response) => {
  const result = await OfferedCourseService.inserIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offred Course Created",
    data:result
  })
})

const updateDataById = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params
  const data = req.body;
  const result = await OfferedCourseService.updateDataById(id,data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course updated successfully",
    data: result
    
  })
})
const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await OfferedCourseService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course deleted successfully',
    data:result
  })
})
export const OfferedCourseController = {
  inserIntoDb,
  getAllFromDb,
  getDataById,
  updateDataById,
  deleteFromDb,
};