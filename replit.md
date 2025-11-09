# دليل المصانع الجزائري - Made in Algeria

## Overview
A comprehensive web application serving as a directory for Algerian factories, offering an advanced platform to search for factories and industrial facilities across various sectors in Algeria. The project aims to provide detailed information about each factory, including an interactive map for location, and a robust admin panel for content management. This platform addresses a significant market need by centralizing industrial information, boosting visibility for Algerian manufacturers, and facilitating business connections, ultimately contributing to the national economy.

## User Preferences
I prefer to communicate in Arabic.
I like the use of clear and concise language.
I want iterative development with regular updates.
I prefer detailed explanations for complex changes.
Ask for my approval before implementing major architectural changes or feature additions.
Do not make changes to the existing translation structure without prior discussion.

## System Architecture

### UI/UX Decisions
The application features a clean, responsive design using `shadcn/ui` and `Tailwind CSS`. It supports a multi-language interface (Arabic, English, French) with automatic RTL/LTR adjustment. Interactive elements include a dynamic language switcher, skeleton loading for improved user experience, and a tab-based system for switching between factory list view and map view.

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript, using Vite for fast development, Wouter for routing, and TanStack Query for data management.
- **Backend**: Implemented with Express.js as a REST API, utilizing Drizzle ORM for database interaction.
- **Multi-language System**: A comprehensive translation system managed via `LanguageContext.tsx` and `translations.ts`, supporting type-safe translations and dynamic UI updates.
- **Interactive Map**: Integrates Leaflet 1.9.4 and react-leaflet 4.2.1 to display factory locations on an interactive map of Algeria, with clickable markers and auto-zoom functionality.
- **Admin Panel**: Provides full CRUD (Create, Read, Update, Delete) capabilities for managing factories and their products, accessible via protected routes.
- **Authentication**: Implemented with Passport.js and Google OAuth for secure user login and role-based access control, specifically protecting admin functionalities.

### Feature Specifications
- **Factory Directory**: Displays a searchable and filterable list of factories by name, wilaya (province), and industrial sector. Each factory has a detailed page.
- **Admin Dashboard**: Secure panel for adding, editing, and deleting factory information and managing products.
- **Multi-language Support**: Full UI translation across key components including header, hero section, search filters, factory cards, and footer.
- **Responsive Design**: Optimized for various screen sizes, including specific mobile enhancements for critical components.

### System Design Choices
- **Serverless First**: Designed for deployment on Vercel with a serverless backend architecture (`api/index.ts`) for scalability and cost-efficiency.
- **Database**: PostgreSQL (Neon Serverless) for robust data storage, integrated via Drizzle ORM.
- **API Endpoints**: Structured RESTful API for factories management, supporting GET, POST, PATCH, and DELETE operations.
- **Environment Management**: Utilizes environment variables for sensitive data like `DATABASE_URL`, managed through Replit Secrets and Vercel Environment Variables.

## External Dependencies
- **PostgreSQL**: Specifically Neon Serverless PostgreSQL, for primary data storage.
- **Google OAuth**: Used for user authentication and authorization.
- **Leaflet (and React-Leaflet)**: For interactive mapping functionalities.
- **Vercel**: The primary deployment platform for both frontend and serverless backend.