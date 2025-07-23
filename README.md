
# BIZBOOKS-FRONTEND

BIZBOOKS-FRONTEND is a modern web application for business accounting, built with Next.js and React. It provides modules for managing accounts, items, sales, purchases, reports, imports/exports, and more, with a rich UI and robust features.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack
- **Framework:** Next.js, React
- **UI Libraries:** MUI (Material UI), Ant Design, Bootstrap, FontAwesome, Lucide, Iconify
- **State & Forms:** Formik, Yup
- **Date/Time:** date-fns, dayjs, moment
- **Data Handling:** Axios, PapaParse, xlsx, country-list, country-state-city
- **PDF/Export:** html2pdf.js, pdfmake, jspdf, jspdf-autotable
- **Other:** Draft.js, Slate, JWT-decode, Razorpay
- **Linting/TypeScript:** ESLint, TypeScript

## Features
- Sidebar, Navbar, Footer, Snackbar notifications
- AuthGuard for protected routes
- Import/Export modules (CSV, XLSX, PDF)
- Email template system (`public/email-template.html`)
- Chart of Accounts, Item management, Sales, Purchase, Reports
- Tally integration, Organization management
- Responsive design with custom global styles

## Folder Structure
- `src/app/` - Main app pages and modules
- `src/components/` - Reusable UI components (Sidebar, Navbar, Footer, SnackbarProvider, etc.)
- `src/services/` - API, Auth, Axios, Config, ImportService
- `src/utils/` - Utility functions (api, auth, csvParser, formatters, etc.)
- `src/context/` - Context providers (ImportContext)
- `src/styles/` - Global CSS styles
- `public/` - Static assets and email templates

## Getting Started
Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd bizbooks-frontend
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:

```bash
npm run build
npm start
```

Lint the code:

```bash
npm run lint
```

## Environment Setup
- **TypeScript:** Configured via `tsconfig.json`.
- **ESLint:** Configured via `eslint.config.mjs` (uses Next.js core-web-vitals rules).
- **Global Styles:** See `src/styles/globals.css`.
- **Font Optimization:** Uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

## Usage
- Main layout is in `src/app/layout.js` (includes Sidebar, Navbar, Footer, SnackbarProvider, AuthGuard).
- Import and use components from `src/components/` as needed.
- API and utility functions are in `src/services/` and `src/utils/`.
- Email templates are in `public/email-template.html`.

## Deployment
Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


