import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedTypes.test(ext) || allowedTypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) and pdf are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Configure upload fields for registration
export const registrationUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'aadhaarPhoto', maxCount: 1 },
  { name: 'panPhoto', maxCount: 1 }
]);

export const studentUpload = upload.fields([
  { name: 'photo', maxCount: 1 }
]);
