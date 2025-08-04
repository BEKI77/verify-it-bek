# EduVerify – School Certificate Verification Portal

## Contributors

- Bereket Tadiwos [berekettadiwos00@gmail.com ](berekettadiwos00@gmail.com)

## Problem Statement

Employers and academic institutions often struggle to verify educational credentials due to paper-based processes, lack of central verification authority, and document fraud.

## Planned Solution

EduVerify is a secure web platform that enables:

- Schools to upload verified digital certificates.
- Students to share and manage their credentials.
- Employers to verify authenticity using Fayda ID integration.

## Expected Outcome

- Easy access to verified educational records.
- Reduced forgery and administrative burden.
- Increased trust in certificate-based decisions.

## Fayda’s Role

Fayda ID is used for:

- Secure login & identity verification for all users.
- Ensuring authenticity of participants in the system.
- Linking certificates to verified identities.

## Tech Stack

For detailed documentation, visit [EduVerify Documentation](https://docs.google.com/document/d/1nCBWbSd1rzyfWI6GZUUVCii_pXZ4WfiFr70zxHnE00w/edit?usp=sharing).

- Frontend: React.js + Tailwind
- Backend: Nest.js
- Database: Supabase
- Auth: VeriFayda OIDC (OpenID Connect)
- File Storage: Firebase / AWS S3
- Deployment: Vercel (frontend), Railway/Render (backend)

## Setup Instructions

1. Clone the repo
2. Run `npm install`
3. Setup .env for Fayda OIDC and database
4. Run `npm run dev`

## Frontend `.env.local` Example

The `.env.local` file for the frontend should look like this:

```bash
VITE_CLIENT_ID=your-client-id
VITE_REDIRECT_URL=http://localhost:3000/callback
VITE_AUTHORIZATION_ENDPOINT=https://your-auth-endpoint/authorize
VITE_TOKEN_ENDPOINT=https://your-token-endpoint/token
VITE_USERINFO_ENDPOINT=https://your-userinfo-endpoint/userinfo
VITE_PRIVATE_KEY=your-private-key
VITE_EXPIRATION_TIME=15
VITE_ALGORITHM=RS256
VITE_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
```

Replace the placeholder values (your-client, your-auth-endpoint, etc.) with the actual values for your environment.

## Running with Docker Compose

To run the application using Docker Compose:

1. Ensure Docker and Docker Compose are installed on your system.
2. Create a docker-compose.yml file in the root directory of the project.
3. Run the following command to start the services:

```bash
docker-compose up --build -d
```

4. Access the application at http://localhost:3000 for the frontend and the appropriate port for the backend

## License

The Unlicensed
