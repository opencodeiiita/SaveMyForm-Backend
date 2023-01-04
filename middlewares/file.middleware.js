import multer from 'multer';
import crypto from 'crypto'
import { GridFsStorage } from 'multer-gridfs-storage';


export async function uploadMiddleware(req,res,next){
    const storage = new GridFsStorage({
        url: process.env.MONGO_DB_CONN_STRING,
        file: (req, file) => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString("hex") + path.extname(file.originalname);
              const fileInfo = {
                filename: filename,
                bucketName: "uploads"
              };
              resolve(fileInfo);
            });
          });
        }
    });
    const upload = multer({ storage })
    upload.single('file')
    next()
}