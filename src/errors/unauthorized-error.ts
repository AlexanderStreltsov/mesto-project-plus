import { UNAUTHORIZED } from '../constants/status-codes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

export default UnauthorizedError;
