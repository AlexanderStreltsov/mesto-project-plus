import { type Error } from 'mongoose';

const getCustomValidationMsg = (err: Error.ValidationError) => {
  const messages = Object.values(err.errors).map((error) => error.message);

  return messages.length > 1 ? messages.join(', ') : messages.join('');
};

export default getCustomValidationMsg;
