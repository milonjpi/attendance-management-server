import { NextFunction, Request, Response } from 'express';
import { MultipleFileUploader } from '../../../helpers/multipleUploader';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';

export const bikerFilesUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = MultipleFileUploader.uploader(
    'bikers',
    ['image/jpeg', 'image/jpg', 'image/png'],
    5000000,
    4,
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

// generate biker id
export const generateBikerId = async (): Promise<string> => {
  const currentId = await prisma.biker.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      bikerId: true,
    },
  });

  //increment by 1
  const incrementedId = (
    parseInt(currentId?.bikerId || '88001000') + 1
  ).toString();

  return incrementedId;
};
