import { NextFunction, Request, Response } from 'express';
import { MultipleFileUploader } from '../../../helpers/multipleUploader';
import { IUploadFile } from '../../../interfaces/file';

export const employeeFilesUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = MultipleFileUploader.uploader(
    'employees',
    ['image/jpeg', 'image/jpg', 'image/png'],
    5000000,
    1,
    'Only .jpg, jpeg or .png format allowed!'
  );

  // call the middleware function
  upload.any()(req, res, err => {
    if (err) {
      next(err);
    } else {
      const givenData = req.body.data ? JSON.parse(req.body.data) : {};
      const givenFiles = req.files as IUploadFile[];
      const combinedData = givenFiles?.reduce(
        (acc, el: IUploadFile) => ({ ...acc, [el.fieldname]: el.filename }),
        givenData
      );
      req.body = combinedData;
      next();
    }
  });
};
