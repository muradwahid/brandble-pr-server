import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { BuildingService } from "./building.service";
import pick from "../../../shared/pick";
import { buildingFilterAbleFields } from "./building.constant";
import { paginationFields } from "../../../constants/pagination";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await BuildingService.insertIntoDb(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created successfully',
    data: result
  })
})
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterAbleFields);
  const options = pick(req.query, paginationFields);
  const result =await BuildingService.getAllFromDb(options,filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buildings retrieved successfully',
    meta:result.meta,
    data: result.data
  })
})
const getDataById=catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await BuildingService.getDataById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building retrieved successfully',
    data: result
  })
})
const updateIntoDb=catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const data=req.body
  const result = await BuildingService.updateIntoDb(id,data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successfully',
    data: result
  })
})
const deleteFromDb=catchAsync(async(req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await BuildingService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building deleted successfully',
    data: result
  })
})
export const BuildingController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
};