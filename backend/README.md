<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Verify-It Backend</h1>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications. This project serves as the backend for a certificate verification platform.
</p>

## Description

This is the backend for the **Verify-It** application, built with the [Nest](https://github.com/nestjs/nest) framework. It handles user management, certificate issuance, and verification logic. It uses Drizzle ORM for database interactions with a PostgreSQL database.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm
- A running PostgreSQL instance
- Docker (optional)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables. Create a `.env` file in the root of the `backend` directory by copying the example below.
    ```env
    # .env
    PORT=4000
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    ```

### Database Setup

This project uses `drizzle-kit` for database migrations.

1.  To generate a new migration based on schema changes:

    ```bash
    npm run db:generate
    ```

2.  To apply the migrations to your database:

    ```bash
    npm run db:migrate
    ```

3.  To open Drizzle Studio and view your data:
    ```bash
    npm run db:studio
    ```

### Running the Application

```bash
# Development mode with watch
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### Docker

You can also build and run the application using Docker.

1.  **Migrate the database schema before running Docker Compose**:

    Before starting the application with Docker Compose, ensure the database schema is migrated. Run the following command:

    ```bash
    npm run db:migrate
    ```

2.  Build the Docker image:

    ```bash
    docker build -t .
    ```

3.  Run the container. Make sure you have a `.env` file created.
    ```bash
    # The Dockerfile exposes port 4000,.
    # This command maps port 3000 on your host to port 3000 in the container.
    docker run --env-file .env -p 4000:4000 verify-it-backend
    ```

## License

The unlicensed
