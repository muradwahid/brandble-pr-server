import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseSectionService } from "./offeredCourseSection.service";

const inserIntoDb=catchAsync(async (req:Request,res:Response) => {
  const result = await OfferedCourseSectionService.inserIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course Section Created",
    data:result
  })
})
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course section retrived successfully",
    data:result
  })
})

const updateFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result =await OfferedCourseSectionService.updateFromDb(id, data)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course section updated successfully",
    data:result
  })
})
const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course section deleted successfully",
    data: result
  })
})
export const OfferedCourseSectionController = {
  inserIntoDb,
  getDataById,
  updateFromDb,
  deleteFromDb,
};