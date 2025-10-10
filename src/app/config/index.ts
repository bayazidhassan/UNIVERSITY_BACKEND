import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_password: process.env.DEFAULT_PASS,
  bcrypt_salt: process.env.BCRYPT_SALT,
  jwt_access_token: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  app_email: process.env.APP_EMAIL,
  app_password: process.env.APP_PASSWORD,
};

/*
1) import dotenv
   - dotenv is a package that helps your project read secret values (like passwords, API keys, database links) from a .env file.

2) import path
   - path is a built-in Node.js module to work with file paths.

3) dotenv.config({...})
   - This tells dotenv to load the .env file.
   - The file is found using path.join(process.cwd(), '.env'), which means:
     👉 “look for .env in the project’s root folder”.

4) export default { ... }
   - This creates a configuration object that other files in your project can use.

5) 👉 In short: This code loads secrets from .env and makes them available to your project in one neat object.
*/
