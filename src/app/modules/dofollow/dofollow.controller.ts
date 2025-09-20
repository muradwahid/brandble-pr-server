import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { DoFollowService } from "./dofollow.service";

const createDoFollow = catchAsync(async (req: Request, res: Response) => {
  const genre = await DoFollowService.createDoFollow(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre created successfully!',
    data: genre,
  });
});

const getAllDoFollow = catchAsync(async (req: Request, res: Response) => {
  const genres = await DoFollowService.getAllDoFollow();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genres retrieved successfully!',
    data: genres,
  });
});

const updateDoFollow = catchAsync(async (req: Request, res: Response) => {

  const genre = await DoFollowService.updateDoFollow(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre updated successfully!',
    data: genre,
  });
});

const deleteDoFollow = catchAsync(async (req: Request, res: Response) => {

  const genre = await DoFollowService.deleteDoFollow(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre deleted successfully!',
    data: genre,
  });
});

const getDoFollowById = catchAsync(async (req: Request, res: Response) => {

  const genre = await DoFollowService.getDoFollowById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre retrieved successfully!',
    data: genre,
  });
});

export const DoFollowController = { createDoFollow, getAllDoFollow, updateDoFollow, deleteDoFollow, getDoFollowById };