import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { WriteArticleService } from './writeArticle.service';
import { CustomRequest } from './writeArticle.interface';

const createWriteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WriteArticleService.createWriteArticle(req as CustomRequest);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Write article created successfully',
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getAllWriteArticles = async (req: Request, res: Response) => {
  const result = await WriteArticleService.getAllWriteArticles();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Write articles fetched successfully',
    data: result,
  });
};

const getWriteArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WriteArticleService.getWriteArticleById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Write article fetched successfully',
    data: result,
  });
};

const updateWriteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await WriteArticleService.updateWriteArticle(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Write article updated successfully',
    data: result,
  });
};

const deleteWriteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WriteArticleService.deleteWriteArticle(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Write article deleted successfully',
    data: result,
  });
};



export const WriteArticleController = {
  createWriteArticle,
  getAllWriteArticles,
  getWriteArticleById,
  updateWriteArticle,
  deleteWriteArticle,
};
