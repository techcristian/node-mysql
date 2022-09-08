import dotenv from 'dotenv';

dotenv.config();

export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD
export const MYSQL_ROOT = process.env.MYSQL_ROOT
export const PORT=process.env.PORT || 3001