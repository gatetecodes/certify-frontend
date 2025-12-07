## Certify Frontend

Angular 21 frontend for certificate management.

### Prerequisites

- Node.js and npm

### Running the Application

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Navigate to `http://localhost:4200`

### Using the Application

#### Login

1. Navigate to the login page at `/login`
2. Enter your email and password
3. After successful login, you'll be redirected based on your role:
   - **System Admin**: Access to Customers management
   - **Tenant Admin/User**: Access to Templates and Certificates

#### Managing Customers (System Admin Only)

1. Navigate to **Customers** from the header menu
2. View existing organizations/tenants
3. Create a new organization:
   - Enter organization name and slug
   - Provide admin details (full name, email, password)
   - Password must be at least 8 characters with uppercase, lowercase, number, and special character
   - Click **Create Organization**

#### Managing Templates (Tenant Admin/User)

1. Navigate to **Templates** from the header menu
2. View existing certificate templates
3. Create or edit a template:
   - Click **New Template** or select an existing template
   - Enter template name and description
   - Write HTML template using `${placeholderName}` syntax for dynamic fields
   - Add placeholder definitions:
     - Key (variable name)
     - Label (display name)
     - Type (text, date, etc.)
     - Required flag
   - Click **Save Template**

#### Generating Certificates (Tenant Admin/User)

1. Navigate to **Certificates** from the header menu
2. Select a template from the dropdown
3. Fill in the dynamic fields based on the template's placeholders
4. **Preview**: Click **Preview** to see a PDF preview without saving
5. **Generate**: Click **Generate** to create and save the certificate
6. View generated certificates in the list on the right:
   - **Verify**: Open the public verification page
   - **Download**: Download the certificate PDF
   - **Revoke**: (Tenant Admin only) Revoke a certificate

#### Verifying Certificates (Public)

1. Access the verification page via the QR code or verification URL on a certificate
2. Or navigate to `/verify/{publicId}` directly
3. The page displays whether the certificate is valid, revoked, or invalid

### Testing

- Run unit tests: `ng test`
- Build: `ng build`
