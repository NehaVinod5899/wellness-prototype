# Wellness Prototype &mdash; Implementation

Working implementation of the integrated communication, community and
wellbeing prototype described in Chapter 5 (Design) of the dissertation,
extending the Figma prototype (Iteration 2/3) into running code for the
Development chapter.

## Structure

```
backend/    Spring Boot REST API (Java 21, H2 in-memory database)
frontend/   React app (Vite) - all four screens plus Settings
```

## Running it

**Backend** (requires Java 21 and Maven):
```bash
cd backend
mvn spring-boot:run
```
API runs on `http://localhost:8080`. H2 console at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:wellnessdb`, user `sa`, no password) &mdash; useful for
showing persisted data during a demo or viva.

**Frontend** (requires Node.js 18+):
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Start the backend first, since the
frontend calls it directly on load.

## Design traceability

Every component in `frontend/src` and every entity/controller in
`backend/src` has a comment linking it back to a specific DR requirement
or a specific piece of feedback . This was done
deliberately so the Development chapter can cite the code directly.


## Suggested GitHub workflow (for your Development chapter write-up)

1. `git init` at the repository root (above both `backend/` and `frontend/`).
2. Commit `backend/` and `frontend/` as separate initial commits, so your
   commit history shows the two halves of the "cloud-based full-stack
   application" career goal being built out distinctly.
3. Use a `.gitignore` covering `node_modules/`, `dist/`, `target/`, and
   `*.class` (a starter one is included).
4. Reference specific commit hashes in your Development chapter when you
   describe a design decision changing mid-implementation &mdash; this is
   exactly the kind of "document process, best practices, GitHub" evidence
   your original project plan calls for.

## Known limitations (be upfront about these in your Development/Evaluation chapters)

- H2 is in-memory: all data resets on backend restart. Fine for a
  dissertation demo; would need a real database (Postgres, per your AWS/
  Azure background) for anything beyond that.
- No authentication, per the explicit scope decision.

