import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const storage = new GridFsStorage({
  url: process.env.URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        console.log(file);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: process.env.MONGO_BUCKET,
        };
        resolve(fileInfo);
      });
    });
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'Uploads/'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const mongoUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export default mongoUpload;
