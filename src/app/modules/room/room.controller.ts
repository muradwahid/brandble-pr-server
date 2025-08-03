import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Room } from "@prisma/client";
import { Request, Response } from "express";
import { RoomService } from "./room.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { roomFilterAbleFields } from "./room.constant";


const getAllFromDb =catchAsync(async (req:Request,res:Response)=>{
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, roomFilterAbleFields);
  const result =await RoomService.getAllFromDb(options,filters);
  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms retrieved successfully',
    meta:result.meta,
    data: result.data
  })
})
const getDataById=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await RoomService.getDataById(id);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room retrieved successfully',
    data: result
  })
})


const insertIntoDb =catchAsync(async (req:Request,res:Response)=>{
  const data = req.body;
  const result = await RoomService.insertIntoDb(data);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room created successfully!',
    data: result
  })
})
const updateIntoDb=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;
  const data = req.body;
  const result = await RoomService.updateIntoDb(id,data);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully!',
    data: result
  })
})
const deleteFromDb=catchAsync(async (req:Request,res:Response)=>{
  const { id } = req.params;
  const result = await RoomService.deleteFromDb(id);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully!',
    data: result
  })
})
export const RoomController = {
  insertIntoDb,
  getAllFromDb,
  getDataById,
  updateIntoDb,
  deleteFromDb,
};