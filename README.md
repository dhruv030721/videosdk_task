# Invoice Management System

## Overview
The Invoice Management System is a backend application designed to manage invoices with features like CRUD operations, role-based access control (RBAC), and payment tracking. It supports admin and regular user roles, ensuring secure access using JWT-based authentication. The system also includes features such as event-driven architecture and PDF invoice generation.

---

## Features

### CRUD Operations
#### Create:
- Admins can generate invoices with the following details:
  - **Invoice Number:** Auto-generated or custom.
  - **Customer Details:** Name, address, email, phone.
  - **Invoice Date:** Date of invoice creation.
  - **Due Date:** Payment deadline.
  - **Items:** List of items with name, quantity, and unit price.
  - **Tax Rates:** E.g., GST.
  - **Total Amount:** Automatically calculated based on items, taxes, and discounts.
  - **Payment Status:** Pending, paid, or overdue.

#### Read:
- Retrieve a list of invoices or a specific invoice by ID.
- **Admin Users:** Access all invoices.
- **Regular Users:** View only accessible invoices.

#### Update:
- Admins can update invoice details, including modifying items and changing payment status.

#### Delete:
- Admins can delete invoices.

### Role-Based Access Control (RBAC)
- **Admin Users:** Perform all CRUD operations.
- **Regular Users:** Read-only access to their invoices.
- Authentication is implemented using JWT for secure access.

### Core Features
1. **Invoice Number Generation:**
   - Auto-generate unique invoice numbers.
2. **Payment Tracking:**
   - Track payment statuses (e.g., pending, paid, overdue).
   - Allow admins to update payment status.
3. **Tax Calculations:**
   - Calculate taxes automatically based on predefined rates (e.g., GST).
4. **Discounts:**
   - Calculate discount automatically and deduct value from total amount.

### Other Features
1. **Invoice PDF Generation:**
   - Generate downloadable PDFs with all invoice details, formatted for clarity.
2. **Event-Driven Architecture:**
   - Trigger events on invoice creation, update and send mail with pdf of invoice to customer.
   - Use Redis for asynchronous event handling.

---

## Database Schema

### User Model:
- **Username:** Unique username.
- **Password:** Hashed password.
- **Email:** User email id.
- **Role:** Admin or Regular User.

### Invoice Model:
- **Invoice Number:** Auto-generated or custom (Unique ID).
- **Customer Details:** Name, address, email, phone.
- **Invoice Date:** Date of creation.
- **Due Date:** Payment deadline.
- **Items:** List containing name, quantity, and unit price.
- **Tax Rates:** Applicable taxes.
- **Discounts:** Optional discount amount or percentage.
- **Total Amount:** Computed total amount.
- **Payment Status:** Pending, paid, or overdue.

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd invoice-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory with the following:
     ```env
     MONGODB_URL=<your_database_connection_string>
     JWT_SECRET=<your_jwt_secret>
     PORT=<port>
     MAIL_HOST=<your_mail_host>
     MAIL_USER=<your_mail_username>
     MAIL_PASS=<your_mail_password>
     
     ```

4. Run the application:
   ```bash
   npm start
   ```

---

## API Endpoints

### Authentication
- **POST /auth/login:** Authenticate a user and return a JWT.
- **POST /auth/register:** To create new user.

### Invoices
- **POST /invoices:** Create a new invoice (Admin only).
- **PUT /invoices/:invoiceNumber** Update invoice (Admin only).
- **GET /invoices/:id:** Retrieve a specific invoice by ID.
- **GET /invoices?page=1&limit=10:** Get all invoices with pagination. (Admin only)
- **DELETE /invoices/:id:** Delete an invoice (Admin only).
- **POST /invoices/updatePaymentStatus** To change payment status of invoice (Admin only).
- **GET /invoices/pdf/:invoiceNumber** To get PDF of invoice.
- **GET /invoices/getUserInvoices/:email** To get particular user invoices.

---

## Event-Driven Architecture
- **Invoice Created Event:** Send a mail with invoice pdf to customer
- **Invoice Updated Event:** Send a mail with updated invoice pdf to customer
- Events can be handled asynchronously using Redis as an event queue.
