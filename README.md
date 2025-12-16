# TuitionLanka Admin Panel

TuitionLanka Admin Panel is a modern, responsive admin dashboard built using **Next.js, Tailwind CSS, and TypeScript**. It is designed to manage and monitor the TuitionLanka platform efficiently, providing tools for user management, analytics, and content control.

## Features

- **Dashboard Overview** - Key stats and charts for platform performance.
- **User Management** - Manage tutors, students, and admin roles.
- **Data Visualization** - Charts and tables for insights.
- **Authentication** - Secure login and access control.
- **Dark Mode Support** - Switch between light and dark themes.
- **Reusable Components** - Buttons, modals, forms, and alerts.
- **Fully Responsive** - Works across all screen sizes.

All features are built with React and styled using Tailwind CSS for easy customization.

## Tech Stack

- **Next.js 15**
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **ApexCharts** (for charts)
- **Reusable Components**
- **Flatpickr** (for date selection)

## Prerequisites

To get started with TuitionLanka, ensure you have the following prerequisites installed and set up:

- Node.js 18.x or later (recommended to use Node.js 20.x or later)

## Installation

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:

   ```bash
   pnpm install
   # or
   yarn install
   ```

   > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

## Environment Variables

Create a .env.local file in the project root and add the necessary variables:

- NEXT_PUBLIC_API_URL=<your-api-url>
- NEXTAUTH_SECRET=<your-secret-key>

## Customization

- Update colors and branding in Tailwind config (tailwind.config.js).
- Replace default logo and favicon in the /public folder.
- Modify UI components under src/components/ to match your brand style.

## Deployment

You can deploy this app to Vercel, Netlify, or any Node.js hosting service:

- For Vercel:
- pnpm run build
- vercel --prod

## Next Steps:

- Connect the dashboard to your backend API.
- Implement role-based access control.
- Add analytics and reporting features.
