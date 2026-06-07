import multer from "multer";
const ALLOWED_MIMETYPES = new Set<string>([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/zip",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 25*1024*1024
  },
  fileFilter: (_req, file, cb) => {
    if(!ALLOWED_MIMETYPES.has(file.mimetype)){
      return cb(new Error("Tipo de archivo no permitido"));
    }
    cb(null, true);
  },
});