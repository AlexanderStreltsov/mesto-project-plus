import { BAD_REQUEST } from '../constants/status-codes';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

export default BadRequestError;
