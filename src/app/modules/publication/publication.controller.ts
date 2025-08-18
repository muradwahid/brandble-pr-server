import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PublicationService } from './publication.service';

const createPublication = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await PublicationService.createPublication(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication created successfully',
    data: result,
  });
  
};

const getAllPublications = async (req: Request, res: Response) => {
  const result = await PublicationService.getAllPublications();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publications fetched successfully',
    data: result,
  });
};

const getPublicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.getPublicationById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication fetched successfully',
    data: result,
  });
};

const updatePublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.updatePublication(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication updated successfully',
    data: result,
  });
};

const deletePublication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.deletePublication(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication deleted successfully',
    data: result,
  });
};

export const PublicationController = {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
};