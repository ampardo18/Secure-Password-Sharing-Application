# Secure Password Sharing Application

## Overview
The Secure Password Sharing Application is a full-stack application designed to help users securely store and manage passwords for multiple websites. Users can register for an account, sign in, and view their saved credentials in a clean dashboard. The app also supports secure password sharing with other registered users, with built-in safeguards to prevent duplicate sharing and ensure the recipient is a valid user.

## Tech Stack
- Frontend: React, TypeScript, Vite.js, Tailwind CSS
- Backend: Node.js, Express.js, JavaScript
- Database: PostgreSQL
- Packages: Sequelize

## Features
- User registration and login with dedicated RESTful APIs that use JWT-based auth with an HTTP-only cookies
- A dedicated table that neatly displays the websites of passwords the user has saved, alongside a copy button to easily access their passwords
- Password sharing with other registered users through a RESTful API that validates the inputted user and ensures the password hasn't been shared with the requested user
- Built error validation for all RESTful API endpoints and paired it with a clean UI presentation, ensuring users receive clear, specific, and readable feedback
- Responsive UI for small, medium, and large viewports, prioritizing no overflow of components and ensuring consistent readability across all screen sizes

## Challenges
- Implementing error validation on each RESTful API and displaying the error information on the frontend
- Creating and running the Sequelize migration commands for the database models
- Keeping the UI responsive on all viewports, while also maintaining the readability of the dashboard and forms (i.e., new password form)
- Deploying the application to a platform while also fixing an issues that appeared from local environment to a live environment

## Next Steps
- Add password editing and deletion features
- Add loading symbols for all RESTful APIs endpoints (i.e., signing in) to improve UI feedback for users
- Allow for customizable dashboard colors and profile pictures for more user customization

## Local Environment Setup Instructions
1. Install dependencies for frontend and backend
    ```bash
        cd client && npm install
	    cd../server && npm install
    ```
2. Create `server/.env` with the following values:
	```env
        JWT_SECRET=your_jwt_secret
        PORT=3000
        NODE_ENV=production
        DB_USERNAME=your_db_username
        DB_PASSWORD=your_db_passwrod
        DB_HOST=your_db_host
        DB_NAME=your_db_name
        DB_PORT=5432
    ```
    The JWT secret token can be generated with an online tool. The database connection can be made with any database provider such as Supabase or Neon, where this information can be extracted from the connection url. 
3. Create `client/.env` with the following values:
    ```env
        VITE_PUBLIC_HOST=http://localhost:3000
    ```
4. Run the following database migrations commands for the User and User Password tables from the server folder:
    ```bash
        npx sequelize-cli model:generate --name User --attributes first_name:string,last_name:string,password:string,encryption_key:string,email:string
    ```
    ```bash
        npx sequelize-cli model:generate --name UserPassword --attributes ownerUserId:uuid,url:string,email:string,password:string,label:string,sharedByUserId:uuid,weak_encryption:boolean,source_password_id:uuid
    ```
    Here's the command to run these migrations:
    ```bash
        npx sequelize-cli db:migrate
    ```
    To undo the migration, run the command:
    ```bash
        npx sequelize-cli db:migrate:undo
    ```
    Note: the data type for the ID column for both tables will be set to integer. This needs to be changed to:
    ```bash
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID
    ```
5. Start the frontend:
    ```bash
        cd client
        npm run dev
    ```
6. Start the backend:
    ```bash
        cd server
        npm run start
    ```