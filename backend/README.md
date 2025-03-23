
# Jira Clone Backend

A backend REST API for a Jira clone application built with Node.js, Express, Prisma and PostgreSQL.

## Features

- User authentication with JWT
- Role-based authorization
- Task management (CRUD operations)
- Comments on tasks
- Task status/priority management
- Notifications system
- Real-time updates with Socket.io
- API documentation with Swagger

## Technologies

- Node.js & Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Socket.io for real-time features
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/jiraclone
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@jiraclone.com
   API_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   ```
4. Initialize Prisma and generate the client:
   ```
   npx prisma generate
   ```
5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

### Running the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

### API Documentation

Swagger documentation is available at `/api-docs` when the server is running.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/update-password` - Update user password

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/:id/comments` - Add a comment to a task

### Notifications
- `GET /api/notifications` - Get all notifications for the current user
- `PATCH /api/notifications/:id/read` - Mark a notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

## Deployment

This application can be deployed using Docker. A Dockerfile is included in the repository.

To build the Docker image:
```
docker build -t jira-clone-backend .
```

To run the container:
```
docker run -p 5000:5000 --env-file .env jira-clone-backend
```

## License

This project is licensed under the MIT License.
