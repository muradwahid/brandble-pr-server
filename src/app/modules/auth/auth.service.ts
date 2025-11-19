import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { FileUploadHelper } from "../../../helpers/FileUploadHelper";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { IUploadFile } from "../../../interfaces/file";
import prisma from "../../../shared/prisma";
import { CustomRequest, ILoginUserResponse, IUser, IUserLogin } from "./auth.interface";

const allUsers = async () => {
  const result = await prisma.user.findMany();
    return result;
}

const createUser = async (user: IUser) => {
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

const loginUser = async (user: IUserLogin): Promise<ILoginUserResponse> => {
  // Find user by email
    const result = await prisma.user.findFirst({
        where: {
            email: user.email,
        },
        select:{
            id:true,
            name:true,
          email: true,
          password: true,
          role: true,
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

  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { id: result?.id, role: result?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )
  const refreshToken = jwtHelpers.createToken(
    { id: result?.id, role: result?.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
  };
}

const getUserByCookie = async (token: string) => {
  const verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  const { id } = verifiedToken;
  const result = await prisma.user.findUnique({
    where:{
      id
    },
    include:{
      orders:true
    }
  });
  return result;
}



const getSingleUser = async (id: string) => {

    const result = await prisma.user.findUnique({
        where:{
            id
        },
        include:{
          orders:true
        }
    });
    return result;
}
const updateUser = async (
  id: string,
  req: CustomRequest,
) => {


    const file = req.file as IUploadFile;
    const data = { ...req.body };
    if (file) {
      const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
      if (uploadedProfileImage && uploadedProfileImage.secure_url) {
        data.image = uploadedProfileImage.secure_url;
      }
      
    }


  try {
    const result = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id: string) => {

    const result = await prisma.user.delete({
        where:{
            id
        }
    });
    return result;
}

const getAdminRole = async () => {
  const result = await prisma.user.findFirst({
    where:{
      role:'admin'
    }
  });
  return result;
}



export const AuthService = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
    updateUser,
  deleteUser,
  getUserByCookie,
  getAdminRole
}