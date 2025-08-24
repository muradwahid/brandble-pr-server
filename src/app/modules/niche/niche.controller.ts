import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { NicheService } from "./niche.service";

const createNiche = catchAsync(async (req: Request, res: Response) => {
  const niche = await NicheService.createNiche(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Niche created successfully!',
    data: niche,
  });
});

const getAllNiches = catchAsync(async (req: Request, res: Response) => {
  const niches = await NicheService.getAllNiches();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Niches retrieved successfully!',
    data: niches,
  });
});

const updateNiche = catchAsync(async (req: Request, res: Response) => {
  const niche = await NicheService.updateNiche(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Niche updated successfully!',
    data: niche,
  });
});

const deleteNiche = catchAsync(async (req: Request, res: Response) => {
  const niche = await NicheService.deleteNiche(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Niche deleted successfully!',
    data: niche,
  });
});

const getNicheById = catchAsync(async (req: Request, res: Response) => {
  const niche = await NicheService.getNicheById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Niche retrieved successfully!',
    data: niche,
  });
});

export const NicheController = { createNiche, getAllNiches, updateNiche, deleteNiche, getNicheById };