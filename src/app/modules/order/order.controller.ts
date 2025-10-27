import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { orderFilterableFields } from './order.constant';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';

const allOrders = catchAsync(async (req: Request, res: Response) => {

  const options = pick(req.query, paginationFields);
  const filters = pick(req.query, orderFilterableFields);


  const result = await OrderService.allOrders(filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
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

export const OrderController = {
  allOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};