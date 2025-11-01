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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const uploadPdfToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        var _a, _b, _c;
        try {
            if (!file || !file.path) {
                throw new Error('File or file path is undefined');
            }
            if (!fs.existsSync(file.path)) {
                throw new Error(`File not found at path: ${file.path}`);
            }
            // Determine resource type for documents
            const docExtensions = ['doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'];
            const extension = ((_b = (_a = file.originalname) === null || _a === void 0 ? void 0 : _a.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            const resourceType = docExtensions.includes(extension) ? 'raw' : 'auto';
            cloudinary_1.v2.uploader.upload(file.path, {
                resource_type: resourceType,
                public_id: `documents/${(_c = file.originalname) === null || _c === void 0 ? void 0 : _c.replace(/\.[^/.]+$/, "")}_${Date.now()}`,
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
});
exports.FileUploadHelper = {
    uploadToCloudinary,
    upload,
    pdfUpload,
    uploadPdfToCloudinary
};
