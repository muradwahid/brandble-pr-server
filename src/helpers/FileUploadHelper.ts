import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
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
        fileSize: 25 * 1024 * 1024 // 5MB limit
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

const pdfUpload = multer({
    storage:storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
    fileFilter: (req, file, cb) => {
        cb(null, true);
        // const allowedTypes = [
        //     "application/pdf",
        //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        //         "application/msword", // (old .doc files)
        //         "application/octet-stream", // fallback some browsers use
        //             ];

        //             if (allowedTypes.includes(file.mimetype)) {
        //                 cb(null, true);
        //             } else {
        //                 cb(new Error("Only PDF and DOCX files are allowed!"));
        //             }
    },
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

            cloudinary.uploader.upload(file.path,
                (error: Error, result: ICloudinaryResponse) => {
                    if (error) {
                        // Delete file even if upload fails
                        try {
                            if (fs.existsSync(file.path)) {
                                fs.unlinkSync(file.path);
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

const uploadPdfToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            if (!file || !file.path) {
                throw new Error('File or file path is undefined');
            }

            if (!fs.existsSync(file.path)) {
                throw new Error(`File not found at path: ${file.path}`);
            }

            // Determine resource type for documents
            const docExtensions = ['doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'];
            const extension = file.originalname?.split('.').pop()?.toLowerCase() || '';
            const resourceType = docExtensions.includes(extension) ? 'raw' : 'auto';

            console.log('Uploading file:', {
                path: file.path,
                originalname: file.originalname,
                resourceType: resourceType,
                size: file.size
            });

            cloudinary.uploader.upload(file.path, {
                resource_type: resourceType,
                public_id: `documents/${file.originalname?.replace(/\.[^/.]+$/, "")}_${Date.now()}`,
                folder: 'documents'
            }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                // Clean up local file
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                        console.log('Local file deleted:', file.path);
                    }
                } catch (unlinkError) {
                    console.error('Error deleting local file:', unlinkError);
                }

                if (error) {
                    console.error('Cloudinary upload error details:', {
                        message: error.message,
                        stack: error.stack
                    });
                    reject(error);
                } else {
                    if (result) {
                        console.log('Cloudinary upload successful:', result);
                        resolve(result);
                    } else {
                        console.error('Cloudinary upload successful but no result returned.');
                        reject(new Error('Cloudinary upload successful but no result returned.'));
                    }
                }
            });
        } catch (error) {
            console.error('Error in uploadToCloudinary:', error);
            reject(error);
        }
    });
};



export const FileUploadHelper = {
    uploadToCloudinary,
    upload,
    pdfUpload,
    uploadPdfToCloudinary
};