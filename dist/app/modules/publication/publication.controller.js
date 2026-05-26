"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const publication_constant_1 = require("./publication.constant");
const publication_service_1 = require("./publication.service");
const createPublication = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const result = await publication_service_1.PublicationService.createPublication(req);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Publication created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllPublications = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, publication_constant_1.publicationFilterableFieldsController);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await publication_service_1.PublicationService.getAllPublications(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Publications fetched successfully',
        data: result,
    });
});
const exportPublicationsToExcel = (0, catchAsync_1.default)(async (req, res) => {
    const workbook = await publication_service_1.PublicationService.exportPublicationsToExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=publications.xlsx');
    await workbook.xlsx.write(res);
    res.end();
});
const getSearchPublications = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['searchTerm']);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await publication_service_1.PublicationService.getSearchPublications(filters);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Publications fetched successfully',
        data: result,
    });
});
const getPublicationById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await publication_service_1.PublicationService.getPublicationById(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Publication fetched successfully',
        data: result,
    });
});
const getPublicationStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await publication_service_1.PublicationService.getPublicationStatistics();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Publication statistics fetched successfully',
        data: result,
    });
});
const updatePublication = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await publication_service_1.PublicationService.updatePublication(id, req);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Publication updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deletePublication = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await publication_service_1.PublicationService.deletePublication(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Publication deleted successfully',
        data: result,
    });
});
exports.PublicationController = {
    createPublication,
    getAllPublications,
    exportPublicationsToExcel,
    getSearchPublications,
    getPublicationById,
    updatePublication,
    deletePublication,
    getPublicationStatistics
};
