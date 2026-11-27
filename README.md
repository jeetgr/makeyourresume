# Make Your Resume

Free resume builder built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).

Live: https://myr.jeetgr.dev

## Local setup

### Prerequisites

- Node.js 24 (see `.node-version`; Node 26 currently breaks the build)
- [pnpm](https://pnpm.io/) (version pinned in `package.json` → `packageManager`)
- A PostgreSQL database (e.g. [Neon](https://neon.tech/))

### Steps

1. Clone and install

   ```bash
   git clone https://github.com/jeetgr/makeyourresume.git
   cd makeyourresume
   pnpm install
   ```

2. Configure env

   ```bash
   cp .env.example .env
   ```

   Fill in `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`.

3. Set up the database

   ```bash
   pnpm exec prisma migrate deploy
   ```

4. Run

   ```bash
   pnpm dev
   ```

   Open http://localhost:3000.

## Scripts

| Command      | What                   |
| ------------ | ---------------------- |
| `pnpm dev`   | Dev server             |
| `pnpm build` | Production build       |
| `pnpm start` | Serve production build |
| `pnpm lint`  | ESLint                 |

## Roadmap

Being modernized: Next 16, single-page editor, real PDF export, more templates, saved resumes with accounts.

## Contact

Jeet Gangwar - jeetgangwar625@gmail.com

Project link: https://github.com/jeetgr/makeyourresume
