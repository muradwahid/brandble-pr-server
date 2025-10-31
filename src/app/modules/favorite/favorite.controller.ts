import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FavoriteService } from "./favorite.service";

const allFavorites = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FavoriteService.allFavorites(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Favorites retrieved successfully!',
        data: result,
    })
})

const createFavorite = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await FavoriteService.createFavorite(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite added successfully!',
    data: result,
  })
})

const deleteFavorite = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await FavoriteService.deleteFavorite(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite deleted successfully!',
    data: result,
  })
})

export const FavoriteController = {
  allFavorites,
  createFavorite,
  deleteFavorite,
}