const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Destination directories
const kybUploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'kyb');
const productUploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'products');

[kybUploadDir, productUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage engine helper
const createStorage = (destinationDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
    },
  });
};

// KYB Documents Filter: PDF, PNG, JPG, JPEG
const kybFileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, PNG, and JPG documents are allowed for KYB.`), false);
  }
};

// Product Images Filter: Images only (PNG, JPG, JPEG, WEBP)
const productImageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type: ${file.mimetype}. Only JPG, PNG, and WEBP images are allowed for products.`), false);
  }
};

const uploadKybDocs = multer({
  storage: createStorage(kybUploadDir),
  fileFilter: kybFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5,
  },
});

const uploadProductImages = multer({
  storage: createStorage(productUploadDir),
  fileFilter: productImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5, // up to 5 images
  },
});

const reportUploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'reports');

[kybUploadDir, productUploadDir, reportUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const uploadReportPhotos = multer({
  storage: createStorage(reportUploadDir),
  fileFilter: productImageFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB limit per photo
    files: 5, // up to 5 photos
  },
});

module.exports = {
  uploadKybDocs,
  uploadProductImages,
  uploadReportPhotos,
  kybUploadDir,
  productUploadDir,
  reportUploadDir,
};
