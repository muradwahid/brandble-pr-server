import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { CountryService } from "./country.service";

const createCountry = catchAsync(async (req: Request, res: Response) => {
  const country = await CountryService.createCountry(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country created successfully!',
    data: country,
  });
});

const getAllCountry = catchAsync(async (req: Request, res: Response) => {
  const countries = await CountryService.getAllCountry();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Countries retrieved successfully!',
    data: countries,
  });
});

const updateCountry = catchAsync(async (req: Request, res: Response) => {

  const country = await CountryService.updateCountry(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country updated successfully!',
    data: country,
  });
});

const deleteCountry = catchAsync(async (req: Request, res: Response) => {

  const country = await CountryService.deleteCountry(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country deleted successfully!',
    data: country,
  });
});

const getCountryById = catchAsync(async (req: Request, res: Response) => {

  const country = await CountryService.getCountryById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country retrieved successfully!',
    data: country,
  });
});

export const CountryController = { createCountry, getAllCountry, updateCountry, deleteCountry, getCountryById };