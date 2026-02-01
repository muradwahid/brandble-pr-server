import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { CityService } from "./city.service";

const createCity = catchAsync(async (req: Request, res: Response) => {
  const city = await CityService.createCity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'City created successfully!',
    data: city,
  });
});

const getAllCity = catchAsync(async (req: Request, res: Response) => {
  const cities = await CityService.getAllCity();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cities retrieved successfully!',
    data: cities,
  });
});

const updateCity = catchAsync(async (req: Request, res: Response) => {

  const city = await CityService.updateCity(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'City updated successfully!',
    data: city,
  });
});

const deleteCity = catchAsync(async (req: Request, res: Response) => {

  const city = await CityService.deleteCity(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'City deleted successfully!',
    data: city,
  });
});

const getCityById = catchAsync(async (req: Request, res: Response) => {

  const city = await CityService.getCityById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'City retrieved successfully!',
    data: city,
  });
});

export const CityController = { createCity, getAllCity, updateCity, deleteCity, getCityById };