import { Request, Response } from "express";
import { WonArticleService } from "./wonArticle.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createWonArticle = async (req: Request, res: Response) => {
    const { file } = req.body;
    const wonArticle = await WonArticleService.createWonArticle(file);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Won article created successfully",
        data: wonArticle,
    });
};

const getAllWonArticles = async (req: Request, res: Response) => {
    const wonArticles = await WonArticleService.getAllWonArticles();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Won articles fetched successfully",
        data: wonArticles,
    });
};

const getWonArticleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const wonArticle = await WonArticleService.getWonArticleById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Won article fetched successfully",
        data: wonArticle,
    });
};

const updateWonArticle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const wonArticle = await WonArticleService.updateWonArticle(id, req.body);
    if (!wonArticle) {
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Won article not found",
        });
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Won article updated successfully",
        data: wonArticle,
    });
};

const deleteWonArticle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const wonArticle = await WonArticleService.deleteWonArticle(id);
    if (!wonArticle) {
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Won article not found",
        });
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Won article deleted successfully",
        data: wonArticle,
    });
};

export const WonArticleController = {
    createWonArticle,
    getAllWonArticles,
    getWonArticleById,
    updateWonArticle,
    deleteWonArticle,
};