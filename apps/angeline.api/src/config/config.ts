/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();

export const config = {
  port: process.env.PORT || 3001,
  database_path: process.env.DATABASE_PATH || 'db.sqlite',
  image_path: process.env.IMAGE_PATH || 'images',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY as string,
} as const;
