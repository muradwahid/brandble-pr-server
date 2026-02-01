import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { StateService } from "./state.service";

const createState = catchAsync(async (req: Request, res: Response) => {
  const state = await StateService.createState(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State created successfully!',
    data: state,
  });
});

const getAllState = catchAsync(async (req: Request, res: Response) => {
  const states = await StateService.getAllState();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'States retrieved successfully!',
    data: states,
  });
});

const updateState = catchAsync(async (req: Request, res: Response) => {

  const state = await StateService.updateState(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State updated successfully!',
    data: state,
  });
});

const deleteState = catchAsync(async (req: Request, res: Response) => {

  const state = await StateService.deleteState(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State deleted successfully!',
    data: state,
  });
});

const getStateById = catchAsync(async (req: Request, res: Response) => {

  const state = await StateService.getStateById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State retrieved successfully!',
    data: state,
  });
});

export const StateController = { createState, getAllState, updateState, deleteState, getStateById };