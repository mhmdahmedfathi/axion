# Axion

Axion is a backend boilerplate project based on Node.js, Express, MongoDB, and Redis. It includes a structured architecture with Managers, Loaders, and Cortex (Redis-based communication).

## Prerequisites

- **Node.js**: v14+ recommended (Check `package.json` for specific engine requirements if any, current dev works with recent versions).
- **Docker**: (Optional) For running MongoDB easily.
- **MongoDB**: Local instance or Docker container.
- **Redis**: [Upstash Redis](https://upstash.com/) is recommended.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd axion
```

### 2. Environment Configuration

Copy the example environment file to create your local `.env` file:

```bash
cp .env.example .env
```

Open `.env` and fill in the required secrets and Redis configuration:

- `LONG_TOKEN_SECRET`
- `SHORT_TOKEN_SECRET`
- `NACL_SECRET`
- `REDIS_URI`: Get the **TCP connection string** from your Upstash console (Select `Node.js` -> `ioredis`).
  - Format: `redis://default:password@visual-cat-123.upstash.io:6379`
  - **Important**: Do not use the REST API URL (`https://...`) or Token. This application requires a standard TCP Redis connection.

**Note:** If you are running locally without Docker, ensure `MONGO_URI` points to your local instance.

### 3. Installation

Install dependencies using npm:

```bash
npm install
```

## Running the Application

### Option A: Running Locally

Ensure MongoDB is running (locally or via Docker) and `.env` has the correct `REDIS_URI`. Then start the application:

```bash
# Development mode (uses nodemon)
npm run dev

# Production mode
npm start
```

The server usually starts on port `5111` (defined by `USER_PORT`).

### Option B: Running with Docker

You can use Docker Compose to bring up the application along with MongoDB. Ensure `.env` is configured with your Upstash `REDIS_URI`.

```bash
docker-compose up --build
```

This will start:

- **App**: http://localhost:5111
- **MongoDB**: Port 27017

## API Documentation

The specific API endpoints depend on the implemented managers. Generally, the application handles API requests via the `managers/userServer` or similar.

Check `index.js` or `app.js` to see the entry point logic.
For detailed API definitions, refer to `swagger.yaml` in the root directory.

## Running Tests

To run the test suite:

```bash
npm test
```

## Architecture

- **Loaders**: Initialize system components (Managers, MongoDB, Cortex, etc.).
- **Managers**: Business logic layer.
- **Connect**: Database connection logic.
- **Config**: Configuration management.
