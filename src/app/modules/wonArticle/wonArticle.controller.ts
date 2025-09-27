import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { WonArticleService } from "./wonArticle.service";
import { WonArticleCustomRequest } from "./wonArticle.interface";

const createWonArticle = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const result = await WonArticleService.createWonArticle(req as WonArticleCustomRequest);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Won Article created successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }

    // const data = req.body;
    // const result = await WonArticleService.createWonArticle(data);
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: "Won article created successfully",
    //     data: result,
    // });
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