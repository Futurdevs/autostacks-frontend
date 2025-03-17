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

# AutoStacks Architecture

This repository contains the architecture diagram for the AutoStacks application, a platform that integrates with GitHub and provides AI-assisted project creation capabilities.

## Architecture Overview

The architecture diagram (`architecture-diagram.dot`) visualizes the main components and their relationships in the AutoStacks application. The diagram is created using DOT language and can be rendered using tools like Graphviz.

### Key Components

#### Frontend (Next.js)
- **UI Components**: Built with React, Tailwind CSS, and shadcn components
- **Auth Client**: Handles user authentication flows
- **GitHub Integration Client**: Manages GitHub OAuth and repository access
- **Chat/Conversation Client**: Manages conversation UI and state
- **Project Management Client**: Handles project creation and management
- **State Management**: Uses React hooks for state management
- **API Client**: Uses Axios for API communication

#### Backend API
- **Authentication API** (`/api/v1/auth/*`): Handles login, registration, and token management
- **User Management API** (`/api/v1/users/*`): Manages user profiles and settings
- **GitHub Integration API** (`/api/v1/github/*`): Handles GitHub OAuth, installations, and repository access
- **Chat/Conversation API** (`/api/v1/chat/*`): Manages conversations and messages
- **Project Management API** (`/api/v1/project/*`): Handles AI-assisted project creation

#### External Services
- **GitHub**: OAuth authentication and GitHub App integration
- **Database**: Stores user data, conversations, and project information

## Key Functionalities

1. **User Authentication & Registration**
   - Login and registration with email/password
   - Token-based authentication

2. **User Profile Management**
   - View and update user profiles
   - Manage user settings

3. **GitHub Repository Integration & Access**
   - OAuth authentication with GitHub
   - GitHub App installation
   - Repository listing and access
   - File and directory browsing

4. **Conversation Management**
   - Create and manage conversations
   - Send and receive messages
   - Conversation history

5. **AI-Assisted Project Creation**
   - Interactive project requirements gathering
   - AI-powered project generation

## Rendering the Diagram

To render the architecture diagram, you can use Graphviz:

```bash
dot -Tpng architecture-diagram.dot -o architecture-diagram.png
```

Or use online tools like [GraphvizOnline](https://dreampuf.github.io/GraphvizOnline/) by copying the contents of the `.dot` file.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn components, Axios
- **Authentication**: JWT (via jose library)
- **UI Components**: Radix UI primitives, Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **Markdown Rendering**: React Markdown with syntax highlighting
- **Notifications**: React Hot Toast, Sonner
- **Date Handling**: date-fns
- **WebSockets**: Socket.io client (for real-time features)
