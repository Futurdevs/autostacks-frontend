# AutoStacks Frontend

A modern web application built with Next.js for the AutoStacks platform.

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Authentication with JWT
- Responsive design
- API integration with backend services

## Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm/yarn
- Access to the backend API

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd autostacks-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
pnpm build
pnpm start
```

## Docker Deployment

This project includes Docker configuration for easy deployment.

### Prerequisites for Docker

- Docker installed on your system
- Docker Compose installed on your system

### Docker Deployment Steps

1. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

2. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

For more detailed Docker deployment instructions, see [README.docker.md](README.docker.md).

## Project Structure

```
├── app/                # Next.js app directory
├── components/         # React components
├── lib/                # Utility functions and libraries
├── middlewares/        # Custom middleware functions
├── public/             # Static assets
├── types/              # TypeScript type definitions
├── .env.example        # Example environment variables
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
├── next.config.mjs     # Next.js configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL`: URL of the backend API
- `JWT_SECRET`: Secret key for JWT token verification

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font family.

## Deployment Options

### Docker (Recommended)

See the [Docker Deployment](#docker-deployment) section above.

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

[MIT](LICENSE)
