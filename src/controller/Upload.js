import { ConnectMongo } from '../database/mongodb';
import AsyncMiddleware from '../middleware/asyncMiddleware';
import ErrorResponse from '../model/response/ErrorResponse';
export const GetFile = AsyncMiddleware(async (req, res, next) => {
  const { filename } = req.params;
  ConnectMongo.gfs.find({ filename }).toArray((err, files) => {
    if (!files || !files.length) {
      return next(new ErrorResponse(404, 'file is not found'));
    }
    ConnectMongo.gfs.openDownloadStreamByName(filename).pipe(res);
  });
});
