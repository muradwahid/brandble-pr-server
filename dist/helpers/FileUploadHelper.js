"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadHelper = void 0;
const cloudinary_1 = require("cloudinary");
const fs = __importStar(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret
});
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// Improved Multer configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, filename);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});
const pdfUpload = (0, multer_1.default)({
    storage: storage,
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
const uploadToCloudinary = async (file) => {
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
            cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
                if (error) {
                    // Delete file even if upload fails
                    try {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    }
                    catch (unlinkError) {
                        console.error('Error deleting local file after upload failure:', unlinkError);
                    }
                    reject(error);
                }
                else {
                    // Delete file after successful upload
                    try {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    }
                    catch (unlinkError) {
                        console.error('Error deleting local file after successful upload:', unlinkError);
                    }
                    resolve(result);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
const uploadPdfToCloudinary = async (file) => {
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
            cloudinary_1.v2.uploader.upload(file.path, {
                resource_type: resourceType,
                public_id: `documents/${file.originalname?.replace(/\.[^/.]+$/, "")}_${Date.now()}`,
                folder: 'documents'
            }, (error, result) => {
                // Clean up local file
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
                catch (unlinkError) {
                    console.error('Error deleting local file:', unlinkError);
                }
                if (error) {
                    console.error('Cloudinary upload error details:', {
                        message: error.message,
                        stack: error.stack
                    });
                    reject(error);
                }
                else {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        console.error('Cloudinary upload successful but no result returned.');
                        reject(new Error('Cloudinary upload successful but no result returned.'));
                    }
                }
            });
        }
        catch (error) {
            console.error('Error in uploadToCloudinary:', error);
            reject(error);
        }
    });
};
//cloudflare
// Cloudflare R2 Configuration
const s3Client = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: config_1.default.cloudflare.endpoint,
    credentials: {
        accessKeyId: config_1.default.cloudflare.accessKeyId,
        secretAccessKey: config_1.default.cloudflare.secretAccessKey,
    },
});
const uploadToR2 = async (file) => {
    if (!file || !file.path)
        throw new Error('File not found');
    const fileStream = fs.createReadStream(file.path);
    const fileKey = `uploads/${Date.now()}-${file.originalname}`;
    try {
        const parallelUploads3 = new lib_storage_1.Upload({
            client: s3Client,
            params: {
                Bucket: config_1.default.cloudflare.bucketName,
                Key: fileKey,
                Body: fileStream,
                ContentType: file.mimetype,
            },
            queueSize: 4,
            partSize: 5 * 1024 * 1024, // 5MB chunks
        });
        const result = await parallelUploads3.done();
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return {
            url: `${config_1.default.cloudflare.publicUrl}/${fileKey}`,
            key: fileKey,
            result
        };
    }
    catch (error) {
        if (fs.existsSync(file.path))
            fs.unlinkSync(file.path);
        throw new ApiError_1.default(500, "R2 Upload Error");
    }
};
exports.FileUploadHelper = {
    uploadToCloudinary,
    upload,
    pdfUpload,
    uploadPdfToCloudinary,
    uploadToR2
};
