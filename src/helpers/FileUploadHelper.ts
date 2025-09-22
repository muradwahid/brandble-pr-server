import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../config';
import { ICloudinaryResponse, IUploadFile } from '../interfaces/file';

// Cloudinary configuration
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Improved Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Improved uploadToCloudinary function with better error handling
// const uploadToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse | undefined> => {
//     return new Promise((resolve, reject) => {
//         try {
//             // Check if file and file.path exist
//             if (!file || !file.path) {
//                 throw new Error('File or file path is undefined');
//             }

//             // Check if file actually exists on disk
//             if (!fs.existsSync(file.path)) {
//                 throw new Error(`File not found at path: ${file.path}`);
//             }

//             cloudinary.uploader.upload(file.path, 
//                 (error: Error, result: ICloudinaryResponse) => {
//                     // Always try to delete the local file
//                     try {
//                         if (fs.existsSync(file.path)) {
//                             fs.unlinkSync(file.path);
//                         }
//                     } catch (unlinkError) {
//                         console.error('Error deleting local file:', unlinkError);
//                     }

//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(result);
//                     }
//                 }
//             );
//         } catch (error) {
//             reject(error);
//         }
//     });
// };


const uploadToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            // Check if file and file.path exist
            if (!file || !file.path) {
                throw new Error('File or file path is undefined');
            }

            // Check if file actually exists on disk
            if (!fs.existsSync(file.path)) {
                throw new Error(`File not found at path: ${file.path}`);
            }

            console.log('Uploading file to Cloudinary:', file.path);
            
            cloudinary.uploader.upload(file.path, 
                (error: Error, result: ICloudinaryResponse) => {
                    if (error) {
                        // Delete file even if upload fails
                        try {
                            if (fs.existsSync(file.path)) {
                                fs.unlinkSync(file.path);
                                console.log('Deleted local file after upload failure:', file.path);
                            }
                        } catch (unlinkError) {
                            console.error('Error deleting local file after upload failure:', unlinkError);
                        }
                        reject(error);
                    } else {
                        // Delete file after successful upload
                        try {
                            if (fs.existsSync(file.path)) {
                                fs.unlinkSync(file.path);
                                console.log('Successfully deleted local file after Cloudinary upload:', file.path);
                            }
                        } catch (unlinkError) {
                            console.error('Error deleting local file after successful upload:', unlinkError);
                        }
                        resolve(result);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });
};

export const FileUploadHelper = {
    uploadToCloudinary,
    upload
};