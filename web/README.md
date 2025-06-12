# Octopilot

A modern web application built with Next.js, TypeScript, and Prisma, for Octopilot.

## 🚀 Tech Stack

- **Framework**: Next.js 15.1.6
- **Language**: TypeScript
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **API Client**: TanStack Query
- **Data Visualization**: Recharts
- **Real-time Communication**: Socket.IO

## 🛠️ Development Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Python (For resume service)
- PostgreSQL (Database)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd octopilot
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=your_database_url
```

4. Initialize the database:

```bash
pnpm db:migrate
```

### Available Scripts

- `pnpm dev` - Run development server (Next.js + Python resume service)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Fix code formatting
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push database schema changes
- `pnpm db:reset` - Reset database
- `pnpm db:studio` - Open Prisma Studio

## 📁 Project Structure

```
octopilot/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── providers/    # Context providers
│   ├── store/        # Zustand store
│   └── types/        # TypeScript types
├── public/           # Static assets
│   ├── images/
│   ├── icons/
│   ├── resume/
│   └── uploads/
└── prisma/          # Database schema and migrations
```

## 🔧 Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **TypeScript** - Type checking

## 🎨 UI/UX Features

- Responsive design with Tailwind CSS
- Dark mode support
- Custom animations with Framer Motion
- Typography plugin for rich text content
- Modern component library with Radix UI

## 🔐 Security

- Environment variables for sensitive data
- NextAuth.js for authentication
- Secure database access with Prisma
- Protected API routes
