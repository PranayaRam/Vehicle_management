# 🚗 Vehicle Service Management System (Apex Motors)

> A production-style, full-stack **MERN** business application managing the complete automotive service workshop lifecycle — from customer registration to final vehicle delivery and service history.

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [The Core Business Workflow](#2-the-core-business-workflow)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Technology Stack](#4-technology-stack)
5. [Architecture & Folder Structure](#5-architecture--folder-structure)
6. [Database Schema Design](#6-database-schema-design)
7. [API Endpoints Overview](#7-api-endpoints-overview)
8. [Demo Credentials](#8-demo-credentials)
9. [Installation & Setup](#9-installation--setup)
10. [Step-by-Step Demonstration Flow](#10-step-by-step-demonstration-flow)
11. [Enforced Business Rules & Validation](#11-enforced-business-rules--validation)

---

## 1. Project Overview

Vehicle Service Management System is designed for professional automobile garages, authorized dealerships, and multi-brand service centers. Unlike simplistic CRUD apps, this system enforces **realistic connected business rules**:

* **Customer Autonomy**: Transparent itemized estimates where customers must digitally approve or reject work before technicians begin repairs.
* **Strict Garage Workflow**: Vehicles cannot be serviced without customer approval, and cannot be delivered without full payment settlement and quality sign-off.
* **Inventory & Labour Tracking**: Real-time OEM parts stock deduction and technician labour logging.
* **Traceable Audit History**: Status transitions are recorded with timestamps, staff IDs, and remarks.

---

## 2. The Core Business Workflow

```text
CUSTOMER REGISTRATION
       ↓
VEHICLE REGISTRATION (Make, Model, Year, Reg #)
       ↓
SERVICE BOOKING (Select Vehicle, Date/Time, Issue Description)
       ↓
SERVICE CENTER RECEIVES BOOKING
       ↓
VEHICLE CHECK-IN (Odometer, Fuel %, Existing Damage, Complaint)
       ↓
SERVICE JOB CARD CREATED (Unique Job ID e.g., SJ-1001)
       ↓
MULTI-POINT INSPECTION (Engine, Brakes, AC, Tyres, Fluids)
       ↓
PARTS & LABOUR ESTIMATION (Itemized Spare Parts + Labour Charges)
       ↓
DIGITAL ESTIMATE GENERATION (Tax, Subtotal, Backend Recalculated)
       ↓
CUSTOMER APPROVAL GATE (Customer Reviews & Approves/Rejects)
       ↓
SERVICE REPAIR EXECUTION (Technicians perform authorized tasks)
       ↓
QUALITY CONTROL & ROAD TEST (Pass/Fail multi-check inspection)
       ↓
FINAL INVOICE GENERATION (Subtotal, GST/Tax, Final Balance)
       ↓
PAYMENT RECORDING (Simulated Cash, Card, or UPI settlement)
       ↓
VEHICLE READY FOR HANDOVER
       ↓
DELIVERY SIGN-OFF & COMPLETE SERVICE HISTORY ARCHIVAL
```

---

## 3. User Roles & Permissions

| Role | Scope & Permissions |
| :--- | :--- |
| **CUSTOMER** | Manage own vehicles, book appointments, track active service status, view multi-point inspection report, digitally approve/reject estimates, view final invoices, simulate payments, and browse complete service history. |
| **STAFF** | Service Advisor & Technician console: check in arriving vehicles (mileage, fuel, damages), create service jobs, conduct multi-point inspections, allocate spare parts & labour, submit estimates for approval, execute repairs, log quality checks, process payments, and record handovers. |
| **ADMIN** | Executive oversight: manage service types, manage spare parts inventory & low-stock alerts, configure labour catalog, monitor all bookings and service jobs, oversee revenue and financial reports, manage staff accounts. |

---

## 4. Technology Stack

### Frontend
* **React.js (v19)** with **Vite**
* **React Router (v7)** for declarative and protected routing
* **Axios** with request/response JWT interceptors
* **Lucide React** for modern UI icons
* **Vanilla CSS / Custom Automotive Design System** (Zero bloat, fully responsive across mobile, tablet, and desktop)
* **React Context API** (`AuthContext`) for centralized session state

### Backend
* **Node.js** & **Express.js** RESTful API
* **MongoDB** with **Mongoose** ORM
* **JWT (JSON Web Tokens)** for stateless authentication
* **bcryptjs** for salt-hashed password security
* **dotenv** & **cors**

---

## 5. Architecture & Folder Structure

```text
Vehicle_management/
│
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, Sidebar, Topbar, StatusBadge, Modal, EmptyState
│   │   │   ├── vehicles/       # VehicleCard, VehicleModal
│   │   │   └── staff/          # CheckInModal
│   │   ├── context/            # AuthContext & global state
│   │   ├── layouts/            # PublicLayout & DashboardLayout
│   │   ├── pages/              # Role-specific and public view pages
│   │   │   ├── auth/           # Login & Customer Registration
│   │   │   ├── customer/       # CustomerDashboard, MyVehicles, BookService, MyBookings, CustomerEstimates, CustomerInvoices
│   │   │   ├── staff/          # StaffDashboard, BookingsCheckIn, ActiveJobs, JobDetails
│   │   │   ├── admin/          # AdminDashboard, PartsInventory, LabourCatalog, ServiceTypesManager
│   │   │   └── public/         # Home, Services, About, Contact
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── App.jsx             # Main Router definitions
│   │   ├── index.css           # Global automotive styling
│   │   └── main.jsx            # React root mount
│   └── package.json
│
├── server/                     # Express + MongoDB Backend
│   ├── config/                 # Database connection (Mongoose)
│   ├── controllers/            # Controller logic (Auth, Vehicles, Bookings, Jobs, Inspections, Estimates, Parts, Labour, Invoices, Delivery)
│   ├── middleware/             # Auth JWT guard, Role authorization, Error handlers
│   ├── models/                 # Mongoose schemas (User, Vehicle, Booking, ServiceJob, Inspection, Part, Labour, Estimate, Invoice, Payment, Delivery, StatusHistory, Counter)
│   ├── routes/                 # Express API routes
│   ├── utils/                  # JWT helpers, formatters, and seedData script
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment configuration template
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
├── .gitignore
├── package.json                # Root orchestration package
└── README.md
```

---

## 6. Database Schema Design

* **User**: `name`, `email`, `password` (hashed), `phone`, `role` (`CUSTOMER`, `STAFF`, `ADMIN`), `address`, `isActive`
* **Vehicle**: `customerId`, `registrationNumber` (unique), `brand`, `model`, `variant`, `manufacturingYear`, `fuelType`, `currentMileage`, `vin`
* **ServiceType**: `name`, `description`, `basePrice`, `estimatedDuration`, `isActive`
* **Booking**: `bookingNumber` (e.g. `BK-1001`), `customerId`, `vehicleId`, `serviceTypeId`, `preferredDate`, `preferredTime`, `problemDescription`, `status`
* **CheckIn**: `bookingId`, `vehicleId`, `staffId`, `currentMileage`, `fuelLevel`, `exteriorCondition`, `existingDamage`, `customerComplaint`, `checkInDateTime`, `notes`
* **ServiceJob**: `jobNumber` (e.g. `SJ-1001`), `bookingId`, `customerId`, `vehicleId`, `assignedStaffId`, `status`, `reportedProblem`, `serviceNotes`
* **Inspection**: `serviceJobId`, `inspectionItems` (Engine, Brakes, Tyres, Battery, AC, Lights, etc.), `overallNotes`, `inspectedBy`
* **Part**: `name`, `partNumber`, `category`, `stockQuantity`, `minimumStock`, `unitPrice`, `supplier`, `isActive`
* **Labour**: `name`, `description`, `charge`, `estimatedDuration`, `isActive`
* **Estimate**: `estimateNumber` (e.g. `EST-1001`), `serviceJobId`, `parts`, `labour`, `subtotal`, `tax`, `total`, `status` (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`)
* **Invoice**: `invoiceNumber` (e.g. `INV-1001`), `serviceJobId`, `customerId`, `vehicleId`, `parts`, `labour`, `subtotal`, `tax`, `total`, `paymentStatus`
* **Payment**: `invoiceId`, `amount`, `paymentMethod` (`CASH`, `CARD`, `UPI`), `transactionReference`, `status`
* **Delivery**: `serviceJobId`, `vehicleId`, `customerId`, `deliveredBy`, `recipientName`, `deliveryDate`, `deliveryNotes`, `status`
* **StatusHistory**: `serviceJobId`, `oldStatus`, `newStatus`, `changedBy`, `remarks`, `changedAt`

---

## 7. API Endpoints Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer |
| `POST` | `/api/auth/login` | Public | Login & receive JWT |
| `GET` | `/api/auth/me` | Protected | Restore session user details |
| `GET` | `/api/vehicles/my` | Customer | Get customer vehicles |
| `POST` | `/api/vehicles` | Customer/Admin | Add new vehicle |
| `GET` | `/api/service-types` | Public | List active garage service packages |
| `POST` | `/api/bookings` | Customer | Create service appointment |
| `GET` | `/api/bookings/my` | Customer | View customer appointments |
| `PUT` | `/api/bookings/:id/cancel` | Customer | Cancel pending appointment |
| `POST` | `/api/check-in` | Staff/Admin | Vehicle intake & Job Card creation |
| `GET` | `/api/service-jobs` | Staff/Admin | List active service jobs |
| `POST` | `/api/inspections` | Staff/Admin | Record 8-point diagnostic checklist |
| `POST` | `/api/estimates` | Staff/Admin | Generate parts & labour estimate |
| `PUT` | `/api/estimates/:id/approve`| Customer | Customer approves estimate & deducts stock |
| `PUT` | `/api/estimates/:id/reject` | Customer | Customer declines estimate |
| `PUT` | `/api/service-jobs/:id/status`| Staff/Admin | Advance status (IN_SERVICE, QUALITY_CHECK) |
| `PUT` | `/api/delivery/ready/:jobId`| Staff/Admin | Mark vehicle ready for delivery |
| `POST` | `/api/invoices` | Staff/Admin | Generate final tax invoice |
| `POST` | `/api/payments` | Customer/Staff | Process / simulate payment |
| `POST` | `/api/delivery` | Staff/Admin | Sign off delivery handover (Rule 9 enforced) |
| `GET` | `/api/delivery/history/:id` | Protected | Get complete vehicle service history |
| `GET` | `/api/dashboard/admin` | Admin | High-level metrics, revenue, and low-stock alerts |

---

## 8. Demo Credentials

The database comes pre-seeded with sample accounts for assessment demonstration:

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@apexmotors.com` | `password123` | Vehicle management, booking, quote approval, payment |
| **Staff** | `staff@apexmotors.com` | `password123` | Vehicle check-in, inspection, parts/labour quote, delivery |
| **Admin** | `admin@apexmotors.com` | `password123` | Master control, parts warehouse, revenue, governance |

---

## 9. Installation & Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Running locally on `127.0.0.1:27017` or MongoDB Atlas URI

### 1. Install Dependencies
```bash
# In project root:
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vehicle_management
JWT_SECRET=vehicle_mgmt_jwt_secret_token_secure_key_2026_xyz
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
TAX_RATE=0.18
```

### 3. Seed Database
```bash
cd server
node utils/seedData.js
```

### 4. Run Application
Run the backend server:
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

Run the frontend client:
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

---

## 10. Step-by-Step Demonstration Flow

To demonstrate the full vehicle servicing journey:

1. **Login as Customer**: `customer@apexmotors.com` / `password123`
2. **View / Add Vehicle**: Check registered `Hyundai Creta MH12AB1234` or add a new vehicle.
3. **Book Service**: Choose `General Service`, select tomorrow's date at `09:00 AM`, write symptom: `Brake noise during low speed`.
4. **Login as Staff**: `staff@apexmotors.com` / `password123`
5. **View Booking & Check-In**: Open `Bookings & Check-In`, click `Check In`, record mileage (38,500 km), fuel level (40%), exterior condition, and confirm.
6. **Automatic Job Card Creation**: Service Job `SJ-1001` is automatically initialized in status `INSPECTION`.
7. **Perform Diagnostic Inspection**: Rate 8 items (`Engine`, `Brakes`, `Tyres`, `Battery`, `Engine Oil`, `AC`, `Lights`, `Exterior`). Set `Brakes` and `Engine Oil` to `NEEDS_ATTENTION` / `CRITICAL`. Save inspection -> Status advances to `ESTIMATE_PENDING`.
8. **Allocate Parts & Labour**: In Job Details, add `Ceramic Brake Pads`, `Synthetic Engine Oil`, `Oil Filter`, and corresponding labour tasks.
9. **Generate Digital Estimate**: Click `Generate Estimate` -> Backend recalculates subtotal, 18% GST, and grand total.
10. **Login as Customer**: Open `Estimates & Approvals`, inspect line items, and click `Authorize & Approve Service`.
11. **Inventory Deduction**: Stock quantity for allocated parts automatically decrements in inventory.
12. **Login as Staff**: Open `Active Jobs` -> Job is now `APPROVED`. Click `Start Service Repairs` (Status -> `IN_SERVICE`).
13. **Complete Service Work**: Mark mechanical repairs finished (Status -> `QUALITY_CHECK`).
14. **Perform Quality Check**: Verify 7 QC items (Engine, Brakes, Tyres, AC, Lights, Road Test, Cleaning). Click `Mark Ready for Delivery`.
15. **Generate Final Tax Invoice**: Click `Generate Final Invoice` -> Invoice `INV-1001` issued with status `UNPAID`.
16. **Attempt Delivery Before Payment**: Attempting handover is strictly blocked with a message enforcing Rule 9.
17. **Record Payment**: Record full payment via UPI/Card/Cash -> Invoice status becomes `PAID`.
18. **Vehicle Handover & Delivery**: Fill recipient name and handover remarks -> Job status becomes `COMPLETED`.
19. **Login as Customer**: Open `Billing & History` -> View complete archival service log showing parts replaced, invoices, and handover timestamp.

---

## 11. Enforced Business Rules & Validation

1. **Ownership Isolation**: Customers cannot view, edit, or book service for vehicles belonging to other accounts.
2. **Sequential Readable Identifiers**: Atomic business numbers (`BK-1001`, `SJ-1001`, `EST-1001`, `INV-1001`).
3. **Odometer Monotonicity**: Intake mileage can never be less than previously logged odometer readings.
4. **Approval Gate**: Technicians are restricted from starting service repairs until the customer digitally approves the itemized estimate.
5. **Inventory Protection**: Parts cannot be allocated beyond currently available warehouse stock.
6. **Server-Side Pricing**: All subtotal, GST (18%), and grand totals are calculated securely on the backend.
7. **Rule 9 Handover Gate**: Vehicles cannot be delivered without `READY_FOR_DELIVERY` status AND `PAID` invoice settlement.
8. **Permanent Audit Trail**: Every status transition logs old state, new state, user ID, and remarks in `StatusHistory`.
