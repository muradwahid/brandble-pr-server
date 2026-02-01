import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { CommonService } from "./common.service";

const getAllCommon = catchAsync(async (req: Request, res: Response) => {
  const countries = await CommonService.getAllCommon();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Common data retrieved successfully!',
    data: countries,
  });
});


export const CommonController = { getAllCommon};