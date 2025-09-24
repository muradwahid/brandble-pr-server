import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";

const allUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.allUsers();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: result,
    })
})

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await AuthService.createUser(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  })
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await AuthService.loginUser(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: result,
  })
})


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.getSingleUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success:true,
    message:'User retrieved successfully!',
    data:result
  })

})

const updateUser = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
    const { id } = req.params;

  try { const result = await AuthService.updateUser(id,req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
  } catch (error) {
    next(error)
  }
});



export const AuthController = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
    updateUser
}