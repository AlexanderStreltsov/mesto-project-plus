import { CONFLICT } from '../constants/status-codes';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

export default ConflictError;
