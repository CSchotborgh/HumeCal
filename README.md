# Hume Lake Christian Camps - Event Calendar

A dynamic, full-stack web application for exploring and engaging with Hume Lake's diverse retreat offerings. The platform provides an intuitive, visually engaging interface for discovering camp events across multiple locations with advanced filtering and print functionality.

## 🚀 Features

- **Multiple Calendar Views**: Month, Week, Year, and List views for different planning perspectives
- **Advanced Filtering**: Filter by event type, price range, age groups, and search terms
- **Event Details**: Comprehensive modal popups with pricing options and registration information
- **User Authentication**: Secure login using Replit OAuth integration
- **Favorites System**: Save and manage favorite events (authenticated users)
- **Print Functionality**: Professional print layouts for all calendar views
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Contact Integration**: Direct access to Hume Lake contact information

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Frontend (React)                      │
├─────────────────────────────────────────────────────────────────┤
│  • Calendar Views (Month/Week/Year/List)                       │
│  • Event Filtering & Search                                    │
│  • Event Details Modal                                         │
│  • User Authentication UI                                      │
│  • Print Functionality                                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │ API Calls (React Query)
┌─────────────────────▼───────────────────────────────────────────┐
│                    Backend (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  • RESTful API Endpoints                                       │
│  • Authentication Middleware (Replit OAuth)                    │
│  • Session Management                                          │
│  • Data Validation (Zod)                                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Database Operations
┌─────────────────────▼───────────────────────────────────────────┐
│                Database (PostgreSQL + Drizzle ORM)             │
├─────────────────────────────────────────────────────────────────┤
│  • Events Storage                                              │
│  • User Management                                             │
│  • Favorites System                                            │
│  • Session Storage                                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Application Flow Diagram

```mermaid
graph TD
    A[User Visits Site] --> B{Authenticated?}
    
    B -->|No| C[Landing Page]
    B -->|Yes| D[Home Calendar]
    
    C --> E[Login via Replit OAuth]
    E --> F[Authentication Success]
    F --> D
    
    D --> G[Select Calendar View]
    G --> H[Month View]
    G --> I[Week View]
    G --> J[Year View]
    G --> K[List View]
    
    H --> L[Apply Filters]
    I --> L
    J --> L
    K --> L
    
    L --> M[View Events]
    M --> N[Click Event]
    N --> O[Event Details Modal]
    
    O --> P{Authenticated?}
    P -->|Yes| Q[Add to Favorites]
    P -->|No| R[View Only]
    
    Q --> S[Manage Favorites]
    R --> T[Close Modal]
    S --> T
    
    T --> U[Print Calendar]
    U --> V[Professional Print Layout]
    
    M --> W[Contact Page]
    W --> X[Hume Lake Contact Info]
    
    style A fill:#e1f5fe
    style D fill:#c8e6c9
    style O fill:#fff3e0
    style U fill:#f3e5f5
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components for consistent design
- **Wouter** for lightweight client-side routing
- **React Query** for server state management and caching
- **React Hook Form** with Zod validation for forms
- **Date-fns** for date manipulation and formatting

### Backend
- **Express.js** REST API with TypeScript
- **Replit OAuth** for secure authentication
- **PostgreSQL** with session storage
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime validation

### Infrastructure
- **Replit** hosting and deployment
- **Neon** serverless PostgreSQL database
- **GitHub** source control

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Replit account for OAuth

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-session-secret
REPL_ID=your-repl-id
REPLIT_DOMAINS=your-domain.replit.app
ISSUER_URL=https://replit.com/oidc
```

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hume-lake-calendar.git
   cd hume-lake-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to the Replit URL
   - The app runs on port 5000 with Vite dev server integration

## 🎯 Key Features Explained

### Calendar Views
- **Month View**: Traditional calendar grid with event indicators
- **Week View**: Detailed 7-day view with event cards
- **Year View**: 12-month overview with event counts
- **List View**: Chronological event listing with search and filters

### Filtering System
- **Event Types**: Women's, Men's, Family, Youth, Teen, Creative, Adventure, Senior
- **Price Range**: Adjustable slider for budget filtering
- **Age Groups**: Target audience filtering
- **Text Search**: Search across event titles, descriptions, and locations

### Authentication Features
- **Replit OAuth**: Secure, seamless login integration
- **Session Management**: PostgreSQL-backed session storage
- **User Profiles**: Basic profile information from OAuth claims
- **Favorites**: Personal event bookmarking system

### Print Functionality
- **Professional Layouts**: Optimized print CSS for all views
- **Header Branding**: Consistent Hume Lake branding on printed pages
- **Page Breaks**: Smart pagination for large calendars
- **Black & White**: Printer-friendly color schemes

## 🔗 API Endpoints

### Public Endpoints
- `GET /api/events` - Retrieve all camp events
- `GET /api/login` - Initiate OAuth login flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - User logout

### Protected Endpoints (Require Authentication)
- `GET /api/auth/user` - Get current user information
- `GET /api/favorites` - Get user's favorite events
- `POST /api/favorites` - Add event to favorites
- `DELETE /api/favorites/:id` - Remove event from favorites

## 📱 Responsive Design

The application uses a mobile-first approach with breakpoints:
- **Mobile**: < 768px - Stacked layout, simplified navigation
- **Tablet**: 768px - 1024px - Adaptive grid layouts
- **Desktop**: > 1024px - Full feature set with sidebars

## 🎨 Design System

### Colors
- **Primary**: Blue theme matching Hume Lake branding
- **Event Types**: Color-coded system for easy identification
- **Backgrounds**: Clean whites and subtle grays
- **Text**: High contrast for accessibility

### Typography
- **System Fonts**: GitHub-style font stack for performance
- **Hierarchy**: Clear heading structure with appropriate sizing
- **Readability**: Optimized line heights and spacing

## 🚀 Deployment

### Replit Deployment
1. Push code to GitHub repository
2. Connect repository to Replit
3. Configure environment variables
4. Deploy using Replit's one-click deployment

### Database Migration
```bash
# Apply schema changes
npm run db:push

# Generate migration files (if needed)
npm run db:generate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test authentication flows
- Ensure print functionality works

## 📞 Support & Contact

### Hume Lake Christian Camps
- **General Information**: (559) 305-7770
- **Registration**: (559) 305-7788
- **Email**: registration@hume.org
- **Website**: [hume.org](https://hume.org)

### Technical Support
- Create an issue in the GitHub repository
- Include browser/device information
- Provide steps to reproduce any bugs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hume Lake Christian Camps** for providing event data and requirements
- **Replit** for hosting and authentication services
- **Neon** for serverless PostgreSQL database
- **Shadcn/ui** for beautiful, accessible UI components

---

Built with ❤️ for the Hume Lake community to help families discover and engage with Christian camp experiences.