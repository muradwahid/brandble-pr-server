import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PublicationService } from './publication.service';
import { publicationSearchableFields } from './publication.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';

const createPublication = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await PublicationService.createPublication(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication created successfully',
    data: result,
  });
});

const getAllPublications = catchAsync(async (req: Request, res: Response) => {

  const filters = pick(req.query, publicationSearchableFields);
  const options = pick(req.query, paginationFields);

  const result = await PublicationService.getAllPublications(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publications fetched successfully',
    data: result,
  });
});

const getPublicationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.getPublicationById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication fetched successfully',
    data: result,
  });
});

const updatePublication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.updatePublication(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication updated successfully',
    data: result,
  });
});

const deletePublication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PublicationService.deletePublication(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Publication deleted successfully',
    data: result,
  });
});

export const PublicationController = {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
};