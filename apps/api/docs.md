# API App Documentation

## Overview

The API app is a Node.js Express server that provides REST endpoints for managing Trello-like boards. It uses Prisma for database operations, Zod for validation, and Pino for logging.

## Structure

- `src/`
  - `app.ts`: Main Express app setup with middleware and routes.
  - `index.ts`: Entry point that starts the server.
  - `controllers/`: Request handlers.
    - `board.controller.ts`: Handlers for board CRUD operations.
  - `services/`: Business logic.
    - `board.service.ts`: Functions for board data manipulation.
  - `routes/`: Route definitions.
    - `board.route.ts`: Board-related routes.
  - `middleware/`: Custom middleware.
    - `errorHandler.ts`: Global error handling.
    - `validate.ts`: Request validation.
  - `utils/`: Utility functions.
    - `appError.ts`: Custom error class.
    - `logging.ts`: Logging utilities.

## Key Components

- **Board Management**: Create, read, update, delete boards with JSON data structure for cards and containers.
- **Validation**: Uses Zod schemas for input validation.
- **Error Handling**: Centralized error handling with custom AppError class.
- **Database**: Prisma ORM with PostgreSQL.