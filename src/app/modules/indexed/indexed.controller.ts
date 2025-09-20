import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { IndexedService } from "./indexed.service";

const createIndexed = catchAsync(async (req: Request, res: Response) => {
  const genre = await IndexedService.createIndexed(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre created successfully!',
    data: genre,
  });
});

const getAllIndexes = catchAsync(async (req: Request, res: Response) => {
  const genres = await IndexedService.getAllIndexes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genres retrieved successfully!',
    data: genres,
  });
});

const updateIndexed = catchAsync(async (req: Request, res: Response) => {

  const genre = await IndexedService.updateIndexed(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre updated successfully!',
    data: genre,
  });
});

const deleteIndexed = catchAsync(async (req: Request, res: Response) => {

  const genre = await IndexedService.deleteIndexed(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre deleted successfully!',
    data: genre,
  });
});

const getIndexedById = catchAsync(async (req: Request, res: Response) => {

  const genre = await IndexedService.getIndexedById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre retrieved successfully!',
    data: genre,
  });
});

export const IndexedController = { createIndexed, getAllIndexes, updateIndexed, deleteIndexed, getIndexedById };