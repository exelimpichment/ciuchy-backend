export {};

// google:
// Made the file a module
// We used the export {} line in our environment.d.ts
// file to mark it as an external module.

// A module is a file that contains at least
// 1 import or export statement.
// We are required to do that to be able
//  to augment the global scope.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      JWT_SECRET: string;
      JWT_LIFETIME: string;
    }
  }
}
