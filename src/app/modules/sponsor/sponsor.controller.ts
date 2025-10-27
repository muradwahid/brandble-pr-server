import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { SponsoredService } from "./sponsor.service";

const createSponsored = catchAsync(async (req: Request, res: Response) => {
  const genre = await SponsoredService.createSponsored(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre created successfully!',
    data: genre,
  });
});

const getAllSponsors = catchAsync(async (req: Request, res: Response) => {
  const genres = await SponsoredService.getAllSponsors();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genres retrieved successfully!',
    data: genres,
  });
});

const updateSponsored = catchAsync(async (req: Request, res: Response) => {

  const genre = await SponsoredService.updateSponsored(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre updated successfully!',
    data: genre,
  });
});

const deleteSponsored = catchAsync(async (req: Request, res: Response) => {

  const genre = await SponsoredService.deleteSponsored(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre deleted successfully!',
    data: genre,
  });
});

const getSponsoredById = catchAsync(async (req: Request, res: Response) => {

  const genre = await SponsoredService.getSponsoredById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre retrieved successfully!',
    data: genre,
  });
});

export const SponsoredController = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };