import { type Request, type Response, type NextFunction } from 'express';
import { type ICustomRequest } from '../types';

const addUserToReqTemp = (req: Request, res: Response, next: NextFunction) => {
  const reqCustom = req as ICustomRequest;
  reqCustom.user = {
    // _id созданного пользователя
    _id: '63f4103349d010a8d5fed06a',
  };

  next();
};

export default addUserToReqTemp;
