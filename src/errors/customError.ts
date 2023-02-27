export class CustomAPIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// now i will create function that creates custom errors

export const createCustomError = (msg: string, statusCode: number) => {
  return new CustomAPIError(msg, statusCode);
};
