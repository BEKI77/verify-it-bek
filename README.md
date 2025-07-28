# EduVerify – School Certificate Verification Portal

## Contributors

- Bereket Tadiwos

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

- Frontend: React.js + Tailwind
- Backend: Nest.js
- Database: PostgreSQL
- Auth: VeriFayda OIDC (OpenID Connect)
- File Storage: Firebase / AWS S3
- Deployment: Vercel (frontend), Railway/Render (backend)

## Setup Instructions

1. Clone the repo
2. Run `npm install`
3. Setup .env for Fayda OIDC and database
4. Run `npm run dev`

## License

MIT
