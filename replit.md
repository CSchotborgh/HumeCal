# Overview

This is a full-stack web application for displaying and filtering camp events at Hume Lake Christian Camps. The application features a calendar interface where users can view events, apply filters, and see detailed information about each camp offering. It's built as a single-page application with a React frontend and Express backend, using PostgreSQL for data storage.

# User Preferences

Preferred communication style: Simple, everyday language.
Design preference: GitHub-like layout and design with modern fonts and clean interface styling.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript, using Vite as the build tool. It follows a component-based architecture with the following key design decisions:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with a custom design system using CSS variables for theming
- **State Management**: React Query for server state management and React hooks for local component state
- **Routing**: Uses wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The backend is an Express.js REST API with the following structure:

- **API Layer**: Express routes organized in `/server/routes.ts` providing RESTful endpoints for events
- **Storage Layer**: Abstracted storage interface in `/server/storage.ts` with an in-memory implementation for development
- **Development Setup**: Vite middleware integration for hot module replacement during development

## Data Storage
The application uses a dual storage approach:

- **Development**: In-memory storage with seeded data for rapid development and testing
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Schema Management**: Shared TypeScript types between frontend and backend using Zod schemas
- **Database Migration**: Drizzle Kit for schema migrations and database management

## Key Features
- **Event Calendar**: Multiple calendar views (Month, Week, Year, List) displaying camp events with visual indicators
- **Advanced Filtering**: Multi-faceted filtering by event type, price range, age groups, and search terms
- **Event Details**: Modal popups showing comprehensive event information including pricing options
- **User Authentication**: Replit OAuth integration for secure user login and session management
- **Favorites System**: Personal event bookmarking for authenticated users
- **Print Functionality**: Professional print layouts for all calendar views with GitHub-style formatting
- **Contact Integration**: Direct access to Hume Lake contact information and navigation
- **Responsive Design**: Mobile-first design approach with adaptive layouts
- **Type Safety**: End-to-end TypeScript implementation with shared schemas

# External Dependencies

## Database and ORM
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect for database operations
- **Drizzle Kit**: Database migration and introspection tools

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind CSS

## Development Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking across the entire application
- **React Query**: Server state management and caching solution
- **Wouter**: Minimalist client-side routing library
- **Date-fns**: Date manipulation and formatting utilities

## Server Infrastructure
- **Express.js**: Node.js web framework for REST API endpoints
- **Session Management**: PostgreSQL-backed session storage using connect-pg-simple
- **Development Integration**: Custom Vite middleware for seamless development experience

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

## Authentication and Security
- **Replit OAuth**: OpenID Connect integration for secure user authentication
- **Session Management**: PostgreSQL-backed session storage with secure cookie handling
- **User Management**: Database storage of user profiles with OAuth claim integration

## Documentation
- **GitHub README**: Comprehensive documentation with architecture diagrams and setup instructions
- **Flow Diagrams**: Mermaid-based visual representation of application workflow
- **API Documentation**: Complete endpoint documentation with authentication requirements