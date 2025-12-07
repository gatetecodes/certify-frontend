## Certify Frontend

Angular 21 frontend for certificate management.

### Prerequisites

- Node.js and npm

### Running the Application Locally

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Navigate to `http://localhost:4200`

### Using the Application

Demo URL: https://sec-certificate.usecarelogic.com

#### Login

1. Navigate to the login page at `/login`
2. Enter your email and password (test credentials provided in the Google Slides presentation):
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

   ##### Sample Template Markup

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="UTF-8" />
       <title>Certificate</title>
       <style>
         body {
           font-family: "Times New Roman", Georgia, "Times", serif;
           margin: 0;
           padding: 40px;
           background: #f3f3f3;
         }
         .certificate {
           background: #fffdf5;
           border: 6px solid #b38b59;
           padding: 40px 60px;
           max-width: 900px;
           margin: 0 auto;
           box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
         }
         .inner-border {
           border: 2px solid #d2b48c;
           padding: 30px 40px;
         }
         .title {
           text-align: center;
           font-size: 32px;
           letter-spacing: 4px;
           text-transform: uppercase;
           font-weight: bold;
           margin-bottom: 10px;
         }
         .subtitle {
           text-align: center;
           font-size: 16px;
           color: #555;
           margin-bottom: 40px;
         }
         .recipient-label {
           text-align: center;
           font-size: 16px;
           letter-spacing: 2px;
           text-transform: uppercase;
           color: #777;
         }
         .recipient-name {
           text-align: center;
           font-size: 28px;
           font-weight: bold;
           margin: 10px 0 30px;
         }
         .body-text {
           font-size: 16px;
           line-height: 1.6;
           text-align: center;
           margin: 0 40px 50px;
         }
         .footer {
           display: flex;
           justify-content: space-between;
           align-items: flex-end;
           margin-top: 40px;
         }
         .signature-block {
           text-align: left;
         }
         .signature-line {
           margin-top: 40px;
           border-top: 1px solid #000;
           width: 260px;
         }
         .signature-name {
           margin-top: 8px;
           font-weight: 600;
         }
         .meta {
           font-size: 14px;
           color: #555;
           margin-top: 8px;
         }
         .qr-block {
           text-align: right;
           font-size: 12px;
           color: #555;
         }
         .qr-block img {
           width: 120px;
           height: 120px;
           margin-bottom: 6px;
         }
       </style>
     </head>
     <body>
       <div class="certificate">
         <div class="inner-border">
           <div class="title">Certificate of Appreciation</div>
           <div class="subtitle">This certificate is proudly presented to</div>

           <div class="recipient-label">Presented to</div>
           <div class="recipient-name">${recipientName}</div>

           <p class="body-text">
             In recognition of outstanding performance and valuable contribution.
             Your dedication and hard work have significantly impacted the success
             of our organization.
           </p>

           <div class="footer">
             <div class="signature-block">
               <div class="meta">Issued on: ${issueDate}</div>
               <div class="signature-line"></div>
               <div class="signature-name">${issuerName}</div>
               <div class="meta">On behalf of the company</div>
             </div>

             <div class="qr-block">
               <img src="${qrCodeImage}" alt="Verification QR code" />
               <div>Scan to verify authenticity</div>
               <div>${verificationUrl}</div>
             </div>
           </div>
         </div>
       </div>
     </body>
   </html>
   ```



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
