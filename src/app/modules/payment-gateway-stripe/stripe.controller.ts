import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StripeService } from "./stripe.service";
import { CustomRequest } from "./stripe.interface";

const paymentIntent = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.paymentIntent(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment completed successfully!',
        data: result,
    });
})

const savePaymentInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.savePaymentInfo(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Add payment info successfully!',
        data: result,
    });
})

const createSetupIntent = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.createSetupIntent(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment intent create successful!',
        data: result,
    })
})

const savePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.savePaymentMethod(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment method saved successfully!',
        data: result,
    })
})


const processPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.processPayment(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment process successful!',
        data: result,
    })

})

const getPaymentMethods = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.getPaymentMethods(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Retrive all payment methods successfully',
        data: result,
    })

})
 
const setDefaultPaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.setDefaultPaymentMethod(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Set default payment method successfully',
        data: result,
    })

})
 
const deletePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const result = await StripeService.deletePaymentMethod(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Delete payment method successfully',
        data: result,
    })
})

export const StripeController = {
    paymentIntent,
    savePaymentInfo,
    createSetupIntent,
    savePaymentMethod,
    processPayment,
    getPaymentMethods,
    setDefaultPaymentMethod,
    deletePaymentMethod
}