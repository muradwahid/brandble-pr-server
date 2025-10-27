import { Request, Response } from 'express';
import { ServiceService } from './service.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createService = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ServiceService.createService(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
};

const getAllServices = async (req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services fetched successfully',
    data: result,
  });
};

const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.getServiceById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    data: result,
  });
};

const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ServiceService.updateService(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
};


const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.deleteService(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
};

export const ServiceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};