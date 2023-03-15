export {};

// google:
// Made the file a module
// We used the export {} line in our environment.d.ts
// file to mark it as an external module.

// A module is a file that contains at least
// 1 import or export statement.
// We are required to do that to be able
//  to augment the global scope.

interface IUser {
  name: string;
  role: string;
  userId: string;
}

// this interface was use together with  _namespace NodeJS_
// do not forgert to add --save to dev dependency
// otherwise does not work for me
// source: stuckOverflow

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      JWT_SECRET: string;
      JWT_LIFETIME: string;
    }
  }
}
