# DB Package Documentation

## Overview

The db package provides database access using Prisma ORM with PostgreSQL.

## Structure

- `src/`
  - `index.ts`: Exports Prisma client and disconnect function.
  - `generated/`: Auto-generated Prisma client.
- `prisma/`
  - `schema.prisma`: Database schema definition.
  - `migrations/`: Database migration files.

## Key Components

- **Prisma Client**: ORM for database operations.
- **Board Model**: Stores board data with title and JSON data field.
- **Database Connection**: Handles connection and disconnection.