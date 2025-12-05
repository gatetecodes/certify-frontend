## Certify Frontend – Angular UI

This Angular 17 application provides the UI for the **Sec CERTIFICATE** certificate management system.
It talks to the Spring Boot backend (see the backend `README.md`) and demonstrates all required use cases.

### Key screens

- **Login**
  - Route: `/login`
  - Uses `AuthService` to call `POST /api/auth/login`.
  - Stores the JWT and user info in local storage (`certify_auth`) and exposes role helpers.
- **Tenant administration (system admin only)**
  - Route: `/tenants`
  - Lists existing tenants and allows creating new tenants and initial tenant admin users.
- **Template management (tenant admin)**
  - Route: `/templates`
  - Displays tenant-specific templates and a rich editor for:
    - Name, description, HTML body (Thymeleaf-style `${placeholder}` syntax).
    - Placeholder definitions (key, label, type, required).
  - Saves via `/api/v1/templates` endpoints.
- **Certificate generation (tenant admin / tenant user)**
  - Route: `/certificates`
  - Left side:
    - Choose a template and fill in dynamic fields based on placeholder definitions.
    - **Preview** button calls `POST /api/v1/certificates/simulate` and opens a rendered PDF.
    - **Generate** button calls sync `POST /api/v1/certificates` and refreshes the list.
    - **Async generate** button calls `POST /api/v1/certificates/async` and shows an async job card that polls `/api/v1/certificates/jobs/{id}` until completion.
  - Right side:
    - Table of issued certificates with status badges, issuer, and created date.
    - Actions:
      - **Verify** (link to backend verification URL, opens public verify page).
      - **Download** (downloads the PDF).
      - **Revoke** (tenant admin only, calls `POST /api/v1/certificates/{id}/revoke` and updates status to `REVOKED`).
- **Public verification**
  - Route: `/verify/:publicId`
  - Calls `GET /public/verify/{publicId}` and shows whether the certificate is valid, revoked, or invalid due to hash mismatch.

### Navigation and roles

- `AuthService` exposes the current authenticated user and helpers:
  - `isSystemAdmin` for system-level navigation (tenants page).
  - Tenant admins and users see the template and certificate navigation.
- `auth.guard`:
  - Protects authenticated routes (`/`, `/tenants`, `/templates`, `/certificates`).
- `system-admin.guard`:
  - Restricts `/tenants` to system admins.
- The header (`app.component`) switches between:
  - Tenant navigation (templates, certificates).
  - System admin navigation (tenants/customers).
  - Login / logout button depending on whether a user is authenticated.

### Running the frontend locally

1. **Install dependencies**
   - From the `frontend` directory:
     - `npm install`
2. **Run the dev server**
   - `npm start` or `ng serve --proxy-config proxy.conf.json`
   - Navigate to `http://localhost:4200`.
   - API calls are proxied to the backend (typically `http://localhost:8080`) via `proxy.conf.json`.
3. **Build**
   - `ng build` – artifacts go to `dist/`.
4. **Unit tests**
   - `ng test` runs Angular unit tests (if/when added).

### Mapping to backend endpoints

- `/login` → `POST /api/auth/login`
- `/tenants` → `/api/admin/tenants`
- `/templates` → `/api/v1/templates`
- `/certificates` → `/api/v1/certificates`, `/api/v1/certificates/simulate`, `/api/v1/certificates/async`, `/api/v1/certificates/jobs/{id}`, `/api/v1/certificates/{id}/download`, `/api/v1/certificates/{id}/revoke`
- `/verify/:publicId` → `/public/verify/{publicId}`
