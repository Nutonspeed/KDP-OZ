# O-Z/Gedney Clone

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/lazapas-projects/v0-o-z-gedney-clone)

## Overview

This project was originally scaffolded with [v0.dev](https://v0.dev), but automated syncing has been disabled. The repository is now maintained manually and all updates originate from local development.

## Deployment

Your project is live at:

**[https://vercel.com/lazapas-projects/v0-o-z-gedney-clone](https://vercel.com/lazapas-projects/v0-o-z-gedney-clone)**

## Development

This project requires **Node.js 18 or higher**.

1. Clone this repository.
2. Install dependencies with `pnpm install`.
3. Run the development server with `pnpm dev`.
4. Commit and push changes from your local environment.

### Leads API

The project now includes a simple lead management backend. The `/api/leads` endpoint
returns stored leads via `GET` and accepts new leads via `POST`. By default data is
kept in-memory using mock data, but if the `POSTGRES_URL` environment variable is
provided the route will persist leads to that database using Neon.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
