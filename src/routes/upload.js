import { Router } from 'express';
import { GetFile } from '../controller/Upload';
import mongoUpload from '../middleware/mongoUpload';
import SuccessResponse from '../model/response/SuccessResponse';
const router = Router();

router.post('/', mongoUpload.array('image', 5), (req, res, next) => {
  console.log(req.files);
  res.status(200).json(new SuccessResponse(200, req.files));
});

router.get('/:filename', GetFile);

export default router;
