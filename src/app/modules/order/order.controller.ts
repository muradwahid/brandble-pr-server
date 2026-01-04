import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { adminOrderFilterableFields, orderFilterableFields, singleUserOrderSearchableFields } from './order.constant';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';

const userAllOrders = catchAsync(async (req: Request, res: Response) => {

  const user = req.user;

  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, orderFilterableFields as (keyof typeof req.query)[]);

  const result = await OrderService.userAllOrders(filters,options,user?.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});
const getAdminAllOrders = catchAsync(async (req: Request, res: Response) => {


  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, orderFilterableFields as (keyof typeof req.query)[]);

  const result = await OrderService.getAdminAllOrders(filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});
const getAdminOrders = catchAsync(async (req: Request, res: Response) => {

  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, adminOrderFilterableFields as (keyof typeof req.query)[]);

  const result = await OrderService.getAdminOrders(filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

const userOrders = catchAsync(async (req: Request, res: Response) => { 
  const id= req.user?.id as string;
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, orderFilterableFields as (keyof typeof req.query)[]);


  const result = await OrderService.userOrders(filters, options,id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
})

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.body as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

const runningOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrderService.runningOrders(user?.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Running Order retrieved successfully!',
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {

  const result = await OrderService.getOrderById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});
const getSpecificUserOrders = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  
  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, singleUserOrderSearchableFields);
  const result = await OrderService.getSpecificUserOrders(id,filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully!',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {

  const result = await OrderService.updateOrder(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully!',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.deleteOrder(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully!',
    data: result,
  });
});

const getOrderStatistics = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['today', 'thisWeek']);

  const result = await OrderService.getOrderStatistics(filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order statistics retrieved successfully!',
    data: result,
  });
});

const getRevenueStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getRevenueStatistics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue statistics retrieved successfully!',
    data: result
    });
});
const getPaymentRevenueStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getPaymentRevenueStatistics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Revenue statistics retrieved successfully!',
    data: result
    });
});

const getUpcomingDeadlines = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getUpcomingDeadlines();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Upcoming orders retrieved successfully!',
    data: result
    });
});




const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const { status } = req.body;
  const result = await OrderService.updateOrderStatus(id, status,user?.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status update successfully!',
    data: result,
  })
 })


export const OrderController = {
  userAllOrders,
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