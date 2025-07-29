# EduVerify Frontend

This is the frontend for **EduVerify – School Certificate Verification Portal**, a secure web platform for managing, sharing, and verifying educational certificates. The frontend is built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Fayda ID Integration:** Secure login and authentication using Fayda E-Signet (OIDC).
- **Role-based Dashboards:** Separate dashboards for students, institutions, and verifiers.
- **Certificate Management:** Upload, view, download, and share certificates with QR codes.
- **Instant Verification:** Employers and verifiers can instantly validate certificate authenticity.
- **Modern UI:** Responsive and accessible design with dark mode support.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **State Management:** React Context API
- **Auth:** Fayda OIDC (OpenID Connect)
- **API Requests:** Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-org/eduverify.git
   cd eduverify/frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**

   - Copy .env.local.example to .env.local and fill in the required Fayda OIDC and API endpoints.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   - The app will be available at http://localhost:3000

## Project Structure

    ```sh
    frontend/
    ├── src/
    │   ├── auth/                # Authentication pages and logic
    │   ├── components/          # Reusable UI components
    │   ├── context/             # React context providers (Auth, Theme)
    │   ├── layouts/             # Layout components (Dashboard, etc.)
    │   ├── pages/               # Route pages (Landing, Login, Dashboards)
    │   ├── types/               # TypeScript types
    │   ├── index.css            # Tailwind CSS imports
    │   └── main.tsx             # App entry point
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── README.md
    ```

## Environment Variables

    - Create a .env.local file in the frontend directory with the following variables:


    ```sh
    VITE_CLIENT_ID=your-fayda-client-id
    VITE_REDIRECT_URL=http://localhost:3000/callback
    VITE_AUTHORIZATION_ENDPOINT=https://esignet.example.com/oidc/v1/authorize
    VITE_TOKEN_ENDPOINT=https://esignet.example.com/oidc/v1/token
    VITE_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
    VITE_PRIVATE_KEY=your-base64-encoded-private-key
    ```

## Proxy Setup

    - API requests to /api are proxied to the Fayda Esignet OIDC server as configured in vite.config.ts.
