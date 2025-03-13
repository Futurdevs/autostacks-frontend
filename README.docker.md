# Docker Deployment Guide for AutoStacks Frontend

This guide explains how to deploy the AutoStacks frontend using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Access to the backend API

## Environment Variables

Before deployment, make sure to set up your environment variables:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and set the appropriate values:
   - `NEXT_PUBLIC_BACKEND_URL`: URL of your backend API
   - `JWT_SECRET`: Secret key for JWT token verification

## Deployment Steps

### 1. Build and Start the Container

```bash
docker-compose up -d --build
```

This command builds the Docker image and starts the container in detached mode.

### 2. Verify the Deployment

Check if the container is running:

```bash
docker-compose ps
```

Access the application at http://localhost:3000

### 3. View Logs

```bash
docker-compose logs -f frontend
```

### 4. Stop the Container

```bash
docker-compose down
```

## Production Considerations

For production deployment:

1. Use a proper reverse proxy (like Nginx) in front of the Next.js application
2. Set up SSL/TLS certificates for HTTPS
3. Consider using Docker Swarm or Kubernetes for orchestration
4. Implement proper monitoring and logging solutions

## Troubleshooting

If you encounter issues:

1. Check the container logs: `docker-compose logs frontend`
2. Verify environment variables are correctly set
3. Ensure the backend API is accessible from the container 