import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import httpStatus from "http-status";
import GenreService from "./genre.service";

const createGenre = catchAsync(async (req: Request, res: Response) => {
  const genre = await GenreService.createGenre(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre created successfully!',
    data: genre,
  });
});

const getAllGenres = catchAsync(async (req: Request, res: Response) => {
  const genres = await GenreService.getAllGenres();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genres retrieved successfully!',
    data: genres,
  });
});

const updateGenre = catchAsync(async (req: Request, res: Response) => {

  const genre = await GenreService.updateGenre(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre updated successfully!',
    data: genre,
  });
});

const deleteGenre = catchAsync(async (req: Request, res: Response) => {

  const genre = await GenreService.deleteGenre(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre deleted successfully!',
    data: genre,
  });
});

const getGenreById = catchAsync(async (req: Request, res: Response) => {

  const genre = await GenreService.getGenreById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre retrieved successfully!',
    data: genre,
  });
});

export const GenreController = { createGenre, getAllGenres, updateGenre, deleteGenre, getGenreById };