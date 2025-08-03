import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IUser, IUserLogin } from "./auth.interface";
import bcrypt from "bcrypt";

const allUsers = async ():Promise<IUser[] | null> => {
    const result = await prisma.user.findMany({
        select:{
            id:true,
            name:true,
            email:true,
            password:true,
        }
    });
    return result;
}

const createUser = async (user: IUser): Promise<IUser> => {
  // Check if user already exists by email
  const existingUser = await prisma.user.findFirst({
    where: { email: user.email }
  });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exists');
  }
  // Hash password before saving
  const hashedPassword = await bcrypt.hash(user.password, 10);
  // Create user with hashed password
    const result = await prisma.user.create({
        data: {
            ...user,
            password: hashedPassword
        }
    });
    return result;
}

const loginUser = async (user: IUserLogin):Promise<IUser> => {
  // Find user by email
    const result = await prisma.user.findFirst({
        where: {
            email: user.email,
        },
        select:{
            id:true,
            name:true,
            email:true,
            password:true,
        }
    });
  // Check if user exists
    if(!result){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(user.password as string, result.password as string);
  if(!isPasswordCorrect){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }
    return result;
}

export const AuthService = {
    allUsers,
    createUser,
    loginUser
}