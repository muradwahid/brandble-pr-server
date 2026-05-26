"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const order_constant_1 = require("./order.constant");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const order_service_1 = require("./order.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const userAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.orderFilterableFields);
    const result = await order_service_1.OrderService.userAllOrders(filters, options, user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});
const userPublishedOrders = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.orderFilterableFields);
    const result = await order_service_1.OrderService.userPublishedOrders(filters, options, user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Published Orders retrieved successfully!',
        data: result,
    });
});
const getAdminAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.orderFilterableFields);
    const result = await order_service_1.OrderService.getAdminAllOrders(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});
const getAdminOrders = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.adminOrderFilterableFields);
    const result = await order_service_1.OrderService.getAdminOrders(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});
const userOrders = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user?.id;
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.orderFilterableFields);
    const result = await order_service_1.OrderService.userOrders(filters, options, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.createOrder(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order created successfully!',
        data: result,
    });
});
const runningOrders = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, ['searchTerm']);
    const result = await order_service_1.OrderService.runningOrders(filters, options, user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Running Order retrieved successfully!',
        data: result,
    });
});
const getOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.getOrderById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
    });
});
const getSpecificUserOrders = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const filters = (0, pick_1.default)(req.query, order_constant_1.singleUserOrderSearchableFields);
    const result = await order_service_1.OrderService.getSpecificUserOrders(id, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully!',
        data: result,
    });
});
const updateOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.updateOrder(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order updated successfully!',
        data: result,
    });
});
const deleteOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.deleteOrder(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order deleted successfully!',
        data: result,
    });
});
const getOrderStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['today', 'thisWeek']);
    const result = await order_service_1.OrderService.getOrderStatistics(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order statistics retrieved successfully!',
        data: result,
    });
});
const getRevenueStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.getRevenueStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Revenue statistics retrieved successfully!',
        data: result
    });
});
const getPaymentRevenueStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.getPaymentRevenueStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment Revenue statistics retrieved successfully!',
        data: result
    });
});
const getUpcomingDeadlines = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.getUpcomingDeadlines();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Upcoming orders retrieved successfully!',
        data: result
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { status } = req.body;
    const result = await order_service_1.OrderService.updateOrderStatus(id, status, user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order status update successfully!',
        data: result,
    });
});
exports.OrderController = {
    userAllOrders,
    userPublishedOrders,
    getAdminAllOrders,
    getAdminOrders,
    createOrder,
    runningOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderStatistics,
    updateOrderStatus,
    userOrders,
    getRevenueStatistics,
    getUpcomingDeadlines,
    getSpecificUserOrders,
    getPaymentRevenueStatistics
};
