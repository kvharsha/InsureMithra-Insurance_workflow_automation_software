# InsureMithra - Insurance Workflow Automation System

**A comprehensive MERN stack insurance management platform with advanced features for policy management, claims processing, renewals, and system monitoring.**

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Security Features](#security-features)
- [Performance & Caching](#performance--caching)
- [Monitoring & Backup](#monitoring--backup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🌟 Overview

InsureMithra is a modern, full-stack insurance workflow automation system designed to streamline insurance operations including user authentication, policy management, claims processing, automated renewals, and comprehensive system monitoring. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides a secure, scalable, and user-friendly platform for both customers and administrators.

### Key Capabilities

- **Complete User Management**: Registration, authentication, profile management, and role-based access control
- **Policy Operations**: Search, compare, purchase, and renew insurance policies
- **Claims Processing**: Submit, track, and manage insurance claims with document uploads
- **Automated Renewals**: Smart renewal system with payment processing and email notifications
- **Admin Dashboard**: Comprehensive admin tools for user management, system monitoring, and backups
- **Performance Optimized**: Redis caching, compression, and performance monitoring
- **Automated Monitoring**: Downtime detection with email alerts and incident tracking
- **Secure & Compliant**: JWT authentication, password hashing, audit logging, and security scanning

---

## ✨ Features

### 🔐 Epic 1: User Authentication & Profile Management

#### Story A: User Registration & Login
- **User Registration**: Complete registration with validation
  - First name, last name, email, password
  - Phone number, date of birth, address
  - Email verification system
- **Secure Login**: JWT-based authentication
  - Account lockout after failed attempts
  - Rate limiting on auth endpoints
  - Remember me functionality
- **Session Management**: 
  - Secure token storage
  - Auto-logout on token expiration
  - Multi-device support

#### Story B: Password Reset
- **Forgot Password Flow**: Email-based password reset
  - Secure token generation (15-minute expiry)
  - Email templates with reset links
  - Password strength validation
- **Change Password**: Authenticated users can update passwords
  - Current password verification
  - New password strength requirements
  - Session invalidation on password change

#### Story C: Profile Management
- **View Profile**: Complete profile information display
- **Edit Profile**: Update personal information
  - Name, phone, date of birth
  - Complete address management
  - Profile picture upload (optional)
- **Account Management**:
  - Deactivate account functionality
  - Activity log viewing
  - Account recovery options

#### Story D: Role-Based Access Control (RBAC)
- **User Roles**: 
  - Regular user with standard permissions
  - Admin with elevated privileges
- **Admin Dashboard**:
  - User management interface
  - View all users with filtering and search
  - Change user roles (user ↔ admin)
  - Activate/deactivate user accounts
  - System statistics dashboard
- **Audit Logging**: All admin actions logged to `logs/audit.log`
- **Self-Protection**: Admins cannot modify their own role/status

### 🏥 Epic 2: Policy Management & Purchase

#### Story 1: Policy Search & Discovery
- **Advanced Search**: Multi-criteria policy search
  - Filter by type: 2-Wheeler, 4-Wheeler, Health, Life, Travel
  - Search by model/name using text search
  - Filter by insurer
  - Price range filtering (min/max premium)
- **Policy Details**: Comprehensive policy information
  - Coverage details and benefits
  - Exclusions and terms
  - Premium breakdown
  - Tenure options
- **Policy Comparison**: Compare 2-3 policies side-by-side
  - Feature comparison matrix
  - Price comparison
  - Coverage comparison

#### Story 2: Policy Purchase
- **Purchase Flow**:
  - Select policy and tenure
  - Mock payment integration (card/UPI/netbanking/wallet)
  - Transaction ID generation
  - PDF policy document generation
- **Purchase Management**:
  - View all purchases
  - Download policy PDFs
  - Track policy status
  - Expiry date tracking

### 📝 Epic 3: Claims Processing & Renewals

#### Story 1: Claims Submission
- **Submit Claim**:
  - Link to purchased policy
  - Detailed reason description
  - Multiple document uploads (bills, reports, photos)
  - Automatic claim ID generation
- **Document Management**:
  - Support for various file types
  - File size validation (5MB max)
  - Secure storage
- **Claim Tracking**:
  - View all submitted claims
  - Real-time status updates
  - Submission history

#### Story 2: Claims Status Management (Admin)
- **Admin Claims Dashboard**:
  - View all claims across users
  - Filter by status and policy type
  - Search functionality
- **Status Updates**:
  - Update claim status (Submitted → Under Review → Approved/Rejected → Closed)
  - Add review notes
  - Email notifications on status change
- **Claim History**: Complete audit trail of status changes

#### Story 3: Policy Renewal
- **Renewal Eligibility**:
  - Automatic eligibility check (7-day window before expiry)
  - Renewal amount calculation
  - Days-until-expiry countdown
- **Renewal Process**:
  - Initiate renewal with payment
  - Asynchronous payment processing
  - Status polling
  - Email confirmations
- **Renewal History**:
  - View all renewal transactions
  - Track successful/failed renewals
  - Download renewal receipts

### 🔧 Epic 4: Monitoring, Performance & Operations

#### Story 1: Performance Optimization & Caching
- **Server-Side Caching**:
  - Redis integration with LRU fallback
  - Cache middleware for GET endpoints
  - Automatic cache invalidation
  - TTL-based expiration
  - Cache hit/miss metrics
- **Response Time Monitoring**:
  - Request timing middleware
  - Performance metrics (p50, p95, p99)
  - Slow request detection
  - Performance stats endpoint
- **Optimization Features**:
  - Gzip compression
  - Static asset caching with Cache-Control headers
  - Frontend code splitting with React.lazy
  - Image lazy loading utilities
- **Load Testing**: Autocannon benchmarks for critical flows

#### Story 2: Downtime Monitoring & Alerting
- **Automated Health Checks**:
  - Scheduled checks every 10 minutes
  - HTTP health endpoint monitoring
  - Configurable timeout and interval
- **Smart Alerting**:
  - Email alerts when downtime exceeds 5 minutes
  - No duplicate alerts per incident
  - Recovery notifications
  - Optional webhook support (Slack/PagerDuty)
- **Incident Management**:
  - Persistent downtime records in MongoDB
  - Detailed incident history
  - Statistics dashboard
  - Manual health check trigger

#### Story 3: Backup & Restore
- **Automated Backups**:
  - Daily backup scheduler (midnight)
  - MongoDB dump + uploads folder
  - Compressed tar.gz archives
  - Automatic retention (last 3 backups)
- **Manual Backup**: Admin API endpoint for on-demand backups
- **Restore Functionality**: 
  - Admin-controlled restore from backup
  - Backup verification tool
  - Download backup files
- **Verification**: Test script to validate backup integrity

---

## 🏗 Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Express.js Server                     │
├─────────────────────────────────────────────────────────┤
│  Middleware Layer                                        │
│  ├── Helmet (Security)                                   │
│  ├── CORS                                                │
│  ├── Compression (Gzip)                                  │
│  ├── Rate Limiting                                       │
│  ├── Authentication (JWT)                                │
│  ├── Role Authorization                                  │
│  ├── Cache Middleware (Redis/LRU)                        │
│  └── Timing/Performance Tracking                         │
├─────────────────────────────────────────────────────────┤
│  API Routes                                              │
│  ├── /api/auth          (Authentication)                 │
│  ├── /api/profile       (Profile & RBAC)                 │
│  ├── /api/policies      (Policy Search & Purchase)       │
│  ├── /api/purchases     (Purchase History)               │
│  ├── /api/claims        (Claims Management)              │
│  ├── /api/renewals      (Policy Renewals)                │
│  └── /api/admin         (Admin Operations)               │
├─────────────────────────────────────────────────────────┤
│  Business Logic Layer                                    │
│  ├── Controllers        (Request handling)               │
│  ├── Services           (Business logic)                 │
│  │   ├── Cache Service                                   │
│  │   ├── Payment Service                                 │
│  │   ├── Health Service                                  │
│  │   ├── Downtime Detection                              │
│  │   ├── Alert Service                                   │
│  │   ├── Backup Service                                  │
│  │   └── Storage Service                                 │
│  └── Utils              (Helper functions)               │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  ├── Mongoose Models                                     │
│  │   ├── User                                            │
│  │   ├── Policy                                          │
│  │   ├── Purchase                                        │
│  │   ├── Claim                                           │
│  │   ├── Renewal                                         │
│  │   └── Downtime                                        │
│  └── MongoDB Database                                    │
├─────────────────────────────────────────────────────────┤
│  Background Jobs                                         │
│  ├── Backup Scheduler (Daily midnight)                   │
│  └── Downtime Monitor (Every 10 minutes)                 │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│              React Application (TypeScript)              │
├─────────────────────────────────────────────────────────┤
│  Pages (Lazy Loaded)                                     │
│  ├── Authentication (Login, Register, Reset)             │
│  ├── Dashboard                                           │
│  ├── Profile Management                                  │
│  ├── Policy Search & Purchase                            │
│  ├── Claims (Submit, View, Status)                       │
│  ├── Renewals                                            │
│  └── Admin (Dashboard, Users, Claims, Backups)           │
├─────────────────────────────────────────────────────────┤
│  Components                                              │
│  ├── ProtectedRoute (Auth guard)                         │
│  ├── Navigation                                          │
│  ├── Forms & Inputs                                      │
│  └── UI Components (Material-UI)                         │
├─────────────────────────────────────────────────────────┤
│  State Management                                        │
│  ├── AuthContext (User authentication state)             │
│  └── React Hooks (Local state)                           │
├─────────────────────────────────────────────────────────┤
│  Services                                                │
│  ├── API Client (Axios)                                  │
│  ├── Auth Service                                        │
│  ├── Policy Service                                      │
│  ├── Claims Service                                      │
│  └── Admin Service                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **MongoDB**: v4.4 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm**: v7.x or higher (comes with Node.js)
- **Redis** (Optional, for caching): v6.x or higher ([Download](https://redis.io/download))
- **Git**: For version control ([Download](https://git-scm.com/))

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: 2GB free space
- **OS**: Windows, macOS, or Linux

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kvharsha/InsureMithra-Insurance_workflow_automation_software.git
cd InsureMithra-Insurance_workflow_automation_software
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Windows (PowerShell)
.\scripts\start-mongo.ps1

# macOS/Linux
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas** (Cloud)
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and add to `.env` file

### 5. Set Up Redis (Optional but Recommended)

**Windows:**
```bash
# Install via WSL or use Memurai (Redis for Windows)
# Download from: https://www.memurai.com/
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Skip Redis**: If not installed, the application automatically falls back to in-memory LRU cache.

---

## ⚙ Configuration

### Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

### Configuration File (`.env`)

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5001

# ============================================
# DATABASE
# ============================================
MONGODB_URI=mongodb://localhost:27017/insuremithra
MONGO_URI=mongodb://localhost:27017/insuremithra
DB_NAME=insuremithra

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_EXPIRE=7d

# ============================================
# EMAIL CONFIGURATION
# ============================================
# SMTP Settings (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Email settings (backward compatibility)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=InsureMithra <noreply@insuremithra.com>
FROM_EMAIL=InsureMithra <noreply@insuremithra.com>

# ============================================
# SECURITY
# ============================================
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5

# ============================================
# PERFORMANCE & CACHING (Epic 4 Story 1)
# ============================================
# Redis Configuration (optional - falls back to LRU cache)
REDIS_URL=redis://localhost:6379

# Cache TTL Configuration (in seconds)
CACHE_DEFAULT_TTL=300
CACHE_POLICY_SEARCH_TTL=60
CACHE_POLICY_DETAIL_TTL=300
CACHE_USER_PURCHASES_TTL=30
CACHE_USER_CLAIMS_TTL=30

# Compression
ENABLE_COMPRESSION=true

# ============================================
# MONITORING (Epic 4 Story 2)
# ============================================
# Comma-separated list of service URLs to monitor
MONITOR_SERVICES=http://localhost:5001/api/health

# How often to run health checks (in minutes)
MONITOR_INTERVAL_MINUTES=10

# Downtime threshold before alerting (in milliseconds)
DOWN_ALERT_THRESHOLD_MS=300000

# Health check timeout (in milliseconds)
HEALTH_CHECK_TIMEOUT_MS=5000

# Comma-separated admin emails for alerts
ALERT_EMAILS=admin@insuremithra.com

# Optional: Webhook for Slack/PagerDuty
# ALERT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# ============================================
# BACKUP & RESTORE (Epic 4 Story 3)
# ============================================
# Disable scheduler with DISABLE_BACKUP_SCHEDULER=true

# ============================================
# FILE UPLOAD
# ============================================
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# ============================================
# FRONTEND
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# RENEWAL CONFIGURATION
# ============================================
RENEWAL_WINDOW_DAYS=7

# Payment Gateway
PAYMENT_GATEWAY_MODE=sandbox
SANDBOX_MIN_MS=1000
SANDBOX_MAX_MS=3000
# PAYMENT_PROVIDER_API_KEY=your_key_for_production

# ============================================
# TESTING & BENCHMARKING
# ============================================
BENCH_DURATION=30
BENCH_CONNECTIONS=50
BENCH_PIPELINING=1
BASE_URL=http://localhost:5001
```

### Important Configuration Notes

1. **JWT_SECRET**: Use a strong, random secret key in production. Generate one with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Email Configuration**: 
   - For Gmail, enable 2FA and generate an app-specific password
   - Other SMTP providers: Update host, port, and credentials accordingly

3. **Redis**: Optional but recommended for production. Fallback to in-memory cache if not configured.

4. **MongoDB**: Update `MONGODB_URI` for cloud databases (MongoDB Atlas, etc.)

5. **Alert Emails**: Add comma-separated list of admin emails for downtime alerts

---

## 🏃 Running the Application

### Quick Start (Recommended)

**Option 1: Using Development Script (Bash)**
```bash
./start-dev.sh
```

**Option 2: Manual Start**

**Terminal 1 - Start Backend:**
```bash
npm run dev
# OR for production
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

### Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health
- **Performance Metrics**: http://localhost:5001/api/health/perf

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve Frontend:**
```bash
cd frontend
npm install -g serve
serve -s build -l 3000
```

**Start Backend:**
```bash
NODE_ENV=production npm start
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

| Category | Endpoint | Method | Auth | Description |
|----------|----------|--------|------|-------------|
| **Authentication** |
| Register | `/auth/register` | POST | No | Register new user |
| Login | `/auth/login` | POST | No | User login |
| Logout | `/auth/logout` | POST | Yes | User logout |
| Forgot Password | `/auth/forgot-password` | POST | No | Request password reset |
| Reset Password | `/auth/reset-password` | POST | No | Reset password with token |
| Verify Email | `/auth/verify-email/:token` | GET | No | Verify email address |
| Get Current User | `/auth/me` | GET | Yes | Get authenticated user |
| **Profile** |
| Get Profile | `/profile` | GET | Yes | Get user profile |
| Update Profile | `/profile` | PUT | Yes | Update profile |
| Change Password | `/profile/change-password` | POST | Yes | Change password |
| Deactivate Account | `/profile/deactivate` | POST | Yes | Deactivate account |
| **Admin - User Management** |
| Get All Users | `/profile/admin/users` | GET | Admin | List all users |
| Get User Details | `/profile/admin/users/:id` | GET | Admin | Get specific user |
| Update User Role | `/profile/admin/users/:id/role` | PUT | Admin | Change user role |
| Toggle User Status | `/profile/admin/users/:id/status` | PUT | Admin | Activate/deactivate user |
| Get Statistics | `/profile/admin/stats` | GET | Admin | System statistics |
| **Policies** |
| Search Policies | `/policies/search` | GET | No | Search policies |
| Get Policy Details | `/policies/:id` | GET | No | Get policy details |
| Compare Policies | `/policies/compare` | POST | No | Compare policies |
| **Purchases** |
| Initiate Purchase | `/purchases/initiate` | POST | Yes | Start purchase |
| Get My Purchases | `/purchases/my` | GET | Yes | List user purchases |
| Get Purchase Details | `/purchases/:id` | GET | Yes | Get purchase details |
| Download Policy PDF | `/purchases/:id/pdf` | GET | Yes | Download policy PDF |
| **Renewals** |
| Check Eligibility | `/renewals/eligibility/:purchaseId` | GET | Yes | Check renewal eligibility |
| Initiate Renewal | `/renewals/initiate` | POST | Yes | Start renewal process |
| Get Renewal Status | `/renewals/:renewalId` | GET | Yes | Get renewal status |
| Get My Renewals | `/renewals/my` | GET | Yes | List user renewals |
| **Claims** |
| Submit Claim | `/claims` | POST | Yes | Submit new claim |
| Get My Claims | `/claims` | GET | Yes | List user claims |
| Get Claim Details | `/claims/:id` | GET | Yes | Get claim details |
| **Admin - Claims** |
| Get All Claims | `/claims/admin` | GET | Admin | List all claims |
| Update Claim Status | `/claims/:id/status` | PUT | Admin | Update claim status |
| **Admin - Monitoring** |
| Get Downtimes | `/admin/downtimes` | GET | Admin | List downtime incidents |
| Manual Health Check | `/admin/downtimes/test` | POST | Admin | Trigger health check |
| Get Downtime Stats | `/admin/downtimes/stats` | GET | Admin | Downtime statistics |
| Get Monitor Config | `/admin/downtimes/monitor/config` | GET | Admin | Monitor configuration |
| **Admin - Backups** |
| List Backups | `/admin/backups` | GET | Admin | List available backups |
| Run Backup | `/admin/backups/run` | POST | Admin | Trigger manual backup |
| Restore Backup | `/admin/backups/restore` | POST | Admin | Restore from backup |
| Download Backup | `/admin/backups/download/:name` | GET | Admin | Download backup file |
| **Health** |
| Health Check | `/health` | GET | No | API health status |
| Performance Metrics | `/health/perf` | GET | No | Performance statistics |

### Example API Requests

#### 1. Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3. Search Policies
```bash
curl -X GET "http://localhost:5001/api/policies/search?type=Health&minPrice=5000&maxPrice=20000"
```

#### 4. Submit Claim
```bash
curl -X POST http://localhost:5001/api/claims \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "policyId=507f1f77bcf86cd799439011" \
  -F "reason=Medical treatment for accident" \
  -F "documents=@/path/to/medical-bill.pdf" \
  -F "documents=@/path/to/report.pdf"
```

For complete API documentation with all endpoints, request/response formats, and examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 🗃 Database Models

### User Model
```javascript
{
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  email: String (required, unique, lowercase)
  password: String (required, min 8 chars, hashed)
  role: String (enum: ['user', 'admin'], default: 'user')
  phone: String (validated)
  dateOfBirth: Date
  address: {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  isEmailVerified: Boolean (default: false)
  isActive: Boolean (default: true)
  emailVerificationToken: String
  emailVerificationExpires: Date
  passwordResetToken: String
  passwordResetExpires: Date
  failedLoginAttempts: Number (default: 0)
  lockUntil: Date
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}
```

### Policy Model
```javascript
{
  name: String (required)
  type: String (enum: ['2W', '4W', 'Health', 'Life', 'Travel'])
  model: String (required)
  insurer: String (required)
  premium: Number (required, min: 0)
  coverage: String (required)
  tenure: String (default: '1 year')
  description: String
  exclusions: [String]
  benefits: [String]
  createdAt: Date
}
```

### Purchase Model
```javascript
{
  userId: ObjectId (ref: 'User')
  policyId: ObjectId (ref: 'Policy')
  transactionId: String (required, unique)
  status: String (enum: ['initiated', 'processing', 'success', 'failed'])
  amount: Number (required)
  currency: String (default: 'INR')
  policyNumber: String
  pdfPath: String
  expiryDate: Date
  renewalStatus: String (enum: ['active', 'renewed', 'expired'])
  lastRenewedAt: Date
  renewalHistory: [{
    amount: Number
    paidAt: Date
    transactionId: String
    oldExpiry: Date
    newExpiry: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Claim Model
```javascript
{
  claimId: String (required, unique)
  userId: ObjectId (ref: 'User')
  policyId: ObjectId (ref: 'Policy')
  reason: String (required, max 2000 chars)
  documents: [{
    filename: String
    originalName: String
    mimeType: String
    size: Number
    path: String
  }]
  status: String (enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Closed'])
  submittedAt: Date
  reviewedAt: Date
  reviewedBy: ObjectId (ref: 'User')
  notes: String (max 5000 chars)
  lastUpdatedBy: ObjectId (ref: 'User')
  history: [{
    status: String
    updatedAt: Date
    note: String
    updatedBy: ObjectId (ref: 'User')
  }]
  audit: {
    ipAddress: String
    userAgent: String
    submissionLocation: String
  }
  createdAt: Date
  updatedAt: Date
}
```

### Renewal Model
```javascript
{
  purchaseId: ObjectId (ref: 'Purchase')
  userId: ObjectId (ref: 'User')
  amount: Number (required)
  currency: String (default: 'INR')
  paymentMethod: String (enum: ['card', 'upi', 'netbanking', 'wallet'])
  status: String (enum: ['initiated', 'processing', 'success', 'failed'])
  transactionId: String (required)
  paymentReceiptUrl: String
  oldExpiryDate: Date
  newExpiryDate: Date
  errorMessage: String
  createdAt: Date
  updatedAt: Date
}
```

### Downtime Model
```javascript
{
  serviceUrl: String (required)
  status: String (enum: ['ongoing', 'resolved'])
  startTime: Date (required)
  endTime: Date
  duration: Number (milliseconds)
  alertSent: Boolean (default: false)
  alertSentAt: Date
  recoverySent: Boolean (default: false)
  errorMessage: String
  details: Mixed
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds (default: 12)
- **Role-Based Access Control (RBAC)**: User and Admin roles
- **Token Expiration**: Configurable JWT expiry (default: 24h/7d)
- **Token Blacklisting**: Revoked tokens tracked in memory/Redis

### Account Security
- **Account Lockout**: After 5 failed login attempts
- **Lockout Duration**: 15 minutes
- **Password Requirements**: 
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number, and special character
- **Email Verification**: Email verification flow with expiring tokens
- **Password Reset**: Secure reset with 15-minute expiring tokens

### API Security
- **Helmet.js**: Security headers (XSS, clickjacking, etc.)
- **CORS**: Configured for specific origins
- **Rate Limiting**: 
  - Authentication endpoints: 5 requests per 15 minutes (production)
  - Development: 100 requests per minute
- **Input Validation**: express-validator for all inputs
- **File Upload Security**: 
  - File type validation
  - Size limits (5MB max)
  - Sanitized filenames

### Audit & Logging
- **Audit Logs**: All admin actions logged to `logs/audit.log`
- **Claims Logs**: Claim submissions logged to `logs/claims.log`
- **Security Logs**: Security events in `logs/security.log`
- **Access Logs**: Request logging with Morgan
- **Performance Logs**: Response times in `logs/perf.log`

### Data Protection
- **Password Fields**: Excluded from queries by default (select: false)
- **Sensitive Data**: Never logged or exposed in responses
- **HTTPS Ready**: Production should use HTTPS/TLS
- **Environment Variables**: Secrets in .env, never committed

### Security Scanning
```bash
# Dependency vulnerability scan
npm run security:audit

# Scan dependencies (moderate+)
npm run scan:deps

# ZAP security scan (requires Docker)
npm run scan:zap
```

For the complete security checklist, see [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md).

---

## ⚡ Performance & Caching

### Server-Side Caching

#### Cache Service
- **Redis Integration**: Primary caching with Redis
- **LRU Fallback**: Automatic fallback to in-memory LRU cache
- **TTL Support**: Time-to-live for all cache entries
- **Pattern Deletion**: Wildcard cache invalidation
- **Cache Stats**: Hit/miss metrics and monitoring

#### Cached Endpoints
| Endpoint | Cache Key | TTL | Invalidated On |
|----------|-----------|-----|----------------|
| `GET /api/policies/search` | `policies:search:<query>` | 60s | Policy update |
| `GET /api/policies/:id` | `policy:detail:<id>` | 300s | Policy update |
| `GET /api/purchases/my` | `user:purchases:<userId>` | 30s | Purchase/Renewal |
| `GET /api/claims` | `user:claims:<userId>` | 30s | Claim submission/update |

#### Cache Headers
All cached responses include:
- `X-Cache: HIT|MISS` - Cache status
- `X-Cache-Key: <key>` - Cache key used
- `X-Response-Time: <ms>ms` - Response time

### Performance Optimizations

#### Backend
- **Gzip Compression**: All responses > 1KB compressed
- **Static Asset Caching**: Cache-Control headers
  - Hashed assets: 1 year cache
  - Non-hashed: 1 hour cache
- **Database Indexes**: Optimized queries on User, Policy, Purchase, Claim models
- **Connection Pooling**: MongoDB connection pooling

#### Frontend
- **Code Splitting**: React.lazy for route-based splitting
- **Lazy Loading**: Images loaded on viewport intersection
- **Responsive Images**: srcset for multiple resolutions
- **Bundle Optimization**: Production build with minification

### Performance Monitoring

#### Timing Middleware
- Tracks all request response times
- Logs slow requests (>2000ms) with warnings
- Calculates p50, p95, p99 percentiles
- Exposes `/api/health/perf` endpoint

#### Performance Metrics Endpoint
```bash
GET /api/health/perf?minutes=5
```

Response:
```json
{
  "performance": {
    "totalRequests": 1523,
    "avgResponseTime": 145.32,
    "p50": 98,
    "p95": 287,
    "p99": 456,
    "minResponseTime": 12,
    "maxResponseTime": 1234
  },
  "slowRequests": [...],
  "cache": {
    "hits": 456,
    "misses": 123,
    "hitRate": 0.787
  }
}
```

### Load Testing

Run load tests with Autocannon:

```bash
# Policy search benchmark
npm run bench:search

# Policy details benchmark
npm run bench:details
```

Results saved to `benchmarks/` directory.

For detailed performance guide, see [PERFORMANCE.md](PERFORMANCE.md).

---

## 🔍 Monitoring & Backup

### Downtime Monitoring

#### Automated Health Checks
- **Schedule**: Every 10 minutes (configurable)
- **Timeout**: 5 seconds per check
- **Monitored Services**: Configurable list of endpoints
- **Alert Threshold**: 5 minutes downtime before alerting

#### Alert System
- **Email Alerts**: Sent to configured admin emails
- **Webhook Support**: Optional Slack/PagerDuty integration
- **Alert Types**: 
  - Downtime alert (when threshold exceeded)
  - Recovery notification
- **No Duplicates**: One alert per incident

#### Incident Management
- All incidents stored in MongoDB
- Complete incident history with timestamps
- Manual health check trigger via API
- Statistics dashboard for uptime tracking

#### Admin Endpoints
```bash
# List all downtime incidents
GET /api/admin/downtimes

# Trigger manual health check
POST /api/admin/downtimes/test

# Get downtime statistics
GET /api/admin/downtimes/stats?days=30

# Get monitor configuration
GET /api/admin/downtimes/monitor/config
```

### Backup & Restore

#### Automated Backups
- **Schedule**: Daily at midnight (00:00 server time)
- **Includes**: 
  - MongoDB database dump
  - Uploads folder (policy PDFs, claim documents)
- **Format**: Compressed tar.gz archives
- **Naming**: `db-YYYYMMDD-HHMM.tar.gz`
- **Retention**: Last 3 backups kept automatically

#### Manual Backup
```bash
# Via API (admin only)
POST /api/admin/backups/run

# Via npm script
npm run verify:backups
```

#### Restore Process
```bash
# List available backups
GET /api/admin/backups

# Restore from backup (admin only)
POST /api/admin/backups/restore
{
  "backupName": "db-20251215-0000.tar.gz"
}

# Download backup
GET /api/admin/backups/download/:name
```

#### Backup Verification
Test script validates backup integrity:
```bash
npm run verify:backups
```

Checks:
- Last 3 backups can be restored
- Restored database has > 0 users, policies, purchases
- Data integrity validation

For complete monitoring guide, see [DOWNTIME_MONITORING.md](DOWNTIME_MONITORING.md) and [BACKUP_RESTORE.md](BACKUP_RESTORE.md).

---

## 🧪 Testing

### Test Suite Overview

The project includes comprehensive testing covering:
- Unit tests
- Integration tests
- API tests
- Performance tests
- Security tests

### Running Tests

#### All Tests
```bash
npm test
```

#### Specific Test Suites
```bash
# Authentication tests
npm test tests/auth.test.js

# RBAC tests
npm test tests/rbac.test.js

# Renewal tests
npm run test:renewal

# Downtime monitoring tests
npm run test:downtime

# Performance cache tests
npm test tests/perf.cache.test.js

# Performance latency tests
npm test tests/perf.latency.test.js
```

#### Coverage Report
```bash
npm run coverage:backend
```

Coverage thresholds:
- Statements: 60%
- Branches: 56%
- Functions: 60%
- Lines: 60%

#### Frontend Tests
```bash
cd frontend
npm test

# With coverage
npm run test:ci
```

### CI/CD Testing

#### Pre-commit Checks
```bash
# Lint check
npm run lint

# Security audit
npm run security:audit

# Environment validation
npm run env-check
```

#### CI Pipeline
```bash
# Backend CI tests
npm run test:ci

# Frontend CI tests
cd frontend && npm run test:ci

# Coverage enforcement
node scripts/check-coverage-threshold.mjs

# Audit enforcement
node scripts/fail-on-npm-audit.mjs
```

### Test Structure

```
tests/
├── auth.test.js                    # Authentication tests
├── backup.test.js                  # Backup/restore tests
├── claimStatus.test.js             # Claim status tests
├── downtime.test.js                # Downtime monitoring tests
├── jwtValidation.test.js           # JWT validation tests
├── passwordHash.test.js            # Password hashing tests
├── perf.cache.test.js              # Cache performance tests
├── perf.latency.test.js            # Latency tests
├── rbac.test.js                    # RBAC tests
├── renewal.test.js                 # Renewal tests
├── renewalNotification.test.js     # Renewal notification tests
├── roleAuth.test.js                # Role authorization tests
└── unit/                           # Unit tests directory
```

### Test Database

Tests use MongoDB Memory Server for isolation:
- Temporary in-memory database
- Automatic cleanup after tests
- No impact on development database

Configuration in `jest.config.cjs`:
```javascript
globalSetup: '<rootDir>/scripts/jest-global-setup.cjs'
globalTeardown: '<rootDir>/scripts/jest-global-teardown.cjs'
setupFilesAfterEnv: ['<rootDir>/scripts/jest-setup-after-env.cjs']
```

---

## 🚀 Deployment

### Production Checklist

#### 1. Environment Configuration
- [ ] Update `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` (use crypto.randomBytes)
- [ ] Configure production MongoDB URI (MongoDB Atlas recommended)
- [ ] Set up Redis for caching (ElastiCache, Redis Cloud, etc.)
- [ ] Configure production SMTP for emails
- [ ] Set production `FRONTEND_URL`
- [ ] Configure `ALERT_EMAILS` for admin notifications
- [ ] Set up webhook for alerting (optional)

#### 2. Security Hardening
- [ ] Enable HTTPS/TLS (use Let's Encrypt, AWS Certificate Manager, etc.)
- [ ] Review and tighten CORS origins
- [ ] Enable production rate limiting
- [ ] Set secure cookie flags
- [ ] Review and update CSP headers
- [ ] Run security scans: `npm run scan:deps`
- [ ] Review [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)

#### 3. Performance Optimization
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Enable Redis caching
- [ ] Set appropriate cache TTLs
- [ ] Configure CDN for static assets (optional)
- [ ] Enable gzip compression: `ENABLE_COMPRESSION=true`

#### 4. Monitoring Setup
- [ ] Configure downtime monitoring
- [ ] Set up backup schedule (or use cloud backups)
- [ ] Configure log rotation
- [ ] Set up application monitoring (PM2, New Relic, Datadog, etc.)
- [ ] Configure error tracking (Sentry, Rollbar, etc.)

#### 5. Database
- [ ] Create production database
- [ ] Set up database backups
- [ ] Create indexes (automatic with models)
- [ ] Seed initial policies: `node utils/seed_policies.js`

### Deployment Options

#### Option 1: Traditional Server (VPS, EC2, etc.)

**1. Install Dependencies:**
```bash
# Node.js, MongoDB, Redis, PM2
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb-server redis-server
sudo npm install -g pm2
```

**2. Clone and Setup:**
```bash
git clone <repository-url>
cd InsureMithra
npm install
cd frontend && npm install && npm run build && cd ..
```

**3. Configure Environment:**
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

**4. Start with PM2:**
```bash
# Start backend
pm2 start server.js --name insuremithra-api

# Start frontend (if serving separately)
cd frontend
pm2 serve build 3000 --name insuremithra-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

**5. Configure Nginx (Reverse Proxy):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/InsureMithra/frontend/build;
        try_files $uri /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=insuremithra

  redis:
    image: redis:6-alpine

  backend:
    build: .
    ports:
      - "5001:5001"
    depends_on:
      - mongodb
      - redis
    env_file:
      - .env
    volumes:
      - ./uploads:/app/uploads
      - ./backups:/app/backups
      - ./logs:/app/logs

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Option 3: Cloud Platforms

**Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create insuremithra-app

# Add MongoDB (MongoDB Atlas Add-on)
heroku addons:create mongolab

# Add Redis
heroku addons:create heroku-redis

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**AWS Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js insuremithra

# Create environment
eb create insuremithra-prod

# Deploy
eb deploy
```

**Azure App Service:**
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name insuremithra-rg --location eastus

# Create app service plan
az appservice plan create --name insuremithra-plan --resource-group insuremithra-rg

# Create web app
az webapp create --name insuremithra --resource-group insuremithra-rg --plan insuremithra-plan

# Deploy
az webapp deployment source config-local-git --name insuremithra --resource-group insuremithra-rg
git remote add azure <git-url>
git push azure main
```

### Post-Deployment

1. **Verify Deployment:**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Monitor Logs:**
   ```bash
   pm2 logs insuremithra-api
   # or
   tail -f logs/combined.log
   ```

3. **Set Up Monitoring:**
   - Configure uptime monitoring (UptimeRobot, Pingdom, etc.)
   - Set up error tracking
   - Monitor server resources

4. **Schedule Backups:**
   - Verify automatic backups are running
   - Test restore procedure
   - Set up off-site backup storage

---

## 📁 Project Structure

```
InsureMithra/
├── config/                          # Configuration files
│   ├── logger.js                    # Winston logging configuration
│   └── mailer.js                    # Email configuration (Nodemailer)
│
├── controllers/                     # Request handlers
│   ├── auth.controller.js           # Authentication logic
│   ├── claim.controller.js          # Claims management
│   ├── policy.controller.js         # Policy operations
│   ├── profile.controller.js        # Profile & admin operations
│   ├── purchase.controller.js       # Purchase processing
│   └── renewal.controller.js        # Renewal processing
│
├── middleware/                      # Express middleware
│   ├── auth.js                      # JWT authentication
│   ├── cache.middleware.js          # Caching middleware
│   ├── roleAuth.js                  # Role-based authorization
│   ├── timing.middleware.js         # Performance timing
│   └── upload.js                    # File upload (Multer)
│
├── models/                          # Mongoose models
│   ├── claim.model.js               # Claim schema
│   ├── downtime.model.js            # Downtime incident schema
│   ├── policy.model.js              # Policy schema
│   ├── purchase.model.js            # Purchase schema
│   ├── renewal.model.js             # Renewal schema
│   └── user.model.js                # User schema
│
├── routes/                          # API routes
│   ├── admin.routes.js              # Admin endpoints (downtimes, backups)
│   ├── auth.routes.js               # Authentication routes
│   ├── claim.routes.js              # Claims routes
│   ├── policy.routes.js             # Policy routes
│   ├── profile.routes.js            # Profile & user management
│   ├── purchase.routes.js           # Purchase routes
│   └── renewal.routes.js            # Renewal routes
│
├── services/                        # Business logic services
│   ├── alert.service.js             # Alert/notification service
│   ├── backup.service.js            # Backup operations
│   ├── cache.service.js             # Cache management (Redis/LRU)
│   ├── downtime.service.js          # Downtime detection
│   ├── health.service.js            # Health check service
│   ├── payment.service.js           # Payment processing (mock)
│   ├── restore.service.js           # Restore operations
│   ├── storage.service.js           # File storage
│   └── tokenBlacklist.service.js    # JWT blacklist
│
├── scheduler/                       # Background jobs
│   ├── backupScheduler.js           # Daily backup scheduler
│   └── downtimeMonitor.js           # Periodic health checks
│
├── utils/                           # Utility functions
│   ├── claimIdGenerator.js          # Unique claim ID generation
│   ├── claimStatusNotifier.js       # Claim status email notifications
│   ├── generatePolicyPDF.js         # PDF generation (PDFKit)
│   ├── generateTransactionId.js     # Transaction ID generation
│   ├── renewalCalculator.js         # Renewal calculations
│   ├── renewalSuccessMailer.js      # Renewal email templates
│   ├── transactionId.js             # Transaction ID utilities
│   ├── seed_policies.js             # Seed database with policies
│   └── seed_policies_upsert.js      # Upsert policies
│
├── tests/                           # Test suite
│   ├── auth.test.js                 # Authentication tests
│   ├── backup.test.js               # Backup/restore tests
│   ├── claimStatus.test.js          # Claim status tests
│   ├── downtime.test.js             # Downtime monitoring tests
│   ├── jwtValidation.test.js        # JWT validation tests
│   ├── passwordHash.test.js         # Password hashing tests
│   ├── perf.cache.test.js           # Cache performance tests
│   ├── perf.latency.test.js         # Latency tests
│   ├── rbac.test.js                 # RBAC tests
│   ├── renewal.test.js              # Renewal tests
│   ├── renewalNotification.test.js  # Renewal notifications
│   ├── roleAuth.test.js             # Role authorization tests
│   └── unit/                        # Unit tests
│
├── scripts/                         # Utility scripts
│   ├── check-coverage-threshold.mjs # Coverage enforcement
│   ├── create-ongoing-downtime.js   # Create test downtime
│   ├── create-test-downtime.js      # Test downtime creation
│   ├── env-check.js                 # Environment validation
│   ├── fail-on-npm-audit.mjs        # Audit enforcement
│   ├── jest-global-setup.cjs        # Jest setup
│   ├── jest-global-teardown.cjs     # Jest teardown
│   ├── jest-setup-after-env.cjs     # Per-test setup
│   ├── jest-setup.cjs               # Test configuration
│   ├── save-eslint-report.js        # ESLint reporting
│   ├── send-claim-notify.js         # Test claim notifications
│   ├── send-renewal-notify.js       # Test renewal notifications
│   ├── send-reset-direct.js         # Test password reset email
│   ├── send-to.js                   # Email testing utility
│   ├── start-mongo.ps1              # Start MongoDB (Windows)
│   ├── stop-mongo.ps1               # Stop MongoDB (Windows)
│   └── test-mail.js                 # Email configuration test
│
├── tools/                           # Development tools
│   ├── lighthouse/                  # Lighthouse testing
│   ├── load-test/                   # Load testing scripts
│   │   ├── policy-search-autocannon.js
│   │   └── policy-details-autocannon.js
│   ├── security/                    # Security scanning
│   │   └── zap-scan.sh              # OWASP ZAP scan
│   ├── test-backup-logging.js       # Backup logging test
│   └── verify-backups.js            # Backup verification
│
├── frontend/                        # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   └── ProtectedRoute.tsx   # Auth guard component
│   │   ├── pages/                   # Page components
│   │   │   ├── AdminBackups.jsx     # Admin backup management
│   │   │   ├── AdminClaims.tsx      # Admin claims dashboard
│   │   │   ├── AdminDashboard.tsx   # Admin dashboard
│   │   │   ├── ClaimStatus.tsx      # Claim status page
│   │   │   ├── ClaimSubmit.tsx      # Submit claim page
│   │   │   ├── ComparePolicies.tsx  # Policy comparison
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── DowntimeMonitor.tsx  # Downtime monitor
│   │   │   ├── ForgotPassword.tsx   # Password reset request
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── MyClaims.tsx         # User claims list
│   │   │   ├── MyPurchases.tsx      # User purchases list
│   │   │   ├── Policies.tsx         # Policy listing
│   │   │   ├── PolicyDetails.tsx    # Policy details
│   │   │   ├── PolicyPurchase.tsx   # Purchase flow
│   │   │   ├── PolicyRenewal.tsx    # Renewal flow
│   │   │   ├── PolicySearch.tsx     # Policy search
│   │   │   ├── Profile.tsx          # User profile
│   │   │   ├── Register.tsx         # Registration page
│   │   │   └── ResetPassword.tsx    # Password reset
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.tsx      # Auth state management
│   │   ├── services/                # API services
│   │   │   └── api.ts               # Axios API client
│   │   ├── utils/                   # Utility functions
│   │   │   └── imageHelper.tsx      # Image optimization
│   │   ├── config/                  # Configuration
│   │   ├── App.tsx                  # Main app component
│   │   └── index.tsx                # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── templates/                       # Email templates
│   ├── claimStatusUpdate.html       # Claim status email
│   ├── passwordReset.html           # Password reset email
│   ├── renewalFailure.html          # Renewal failure email
│   ├── renewalSuccess.html          # Renewal success email
│   └── verifyEmail.html             # Email verification
│
├── logs/                            # Log files (auto-generated)
│   ├── audit.log                    # Admin action logs
│   ├── claims.log                   # Claim submission logs
│   ├── combined.log                 # All logs
│   ├── error.log                    # Error logs
│   ├── perf.log                     # Performance logs
│   └── security.log                 # Security event logs
│
├── uploads/                         # Uploaded files
│   └── claims/                      # Claim documents
│
├── backups/                         # Database backups
│   └── db-YYYYMMDD-HHMM.tar.gz      # Backup archives
│
├── receipts/                        # Payment receipts
│
├── benchmarks/                      # Load test results
│   ├── policy-search-*.json
│   └── policy-details-*.json
│
├── coverage/                        # Test coverage reports
│
├── reports/                         # CI/CD reports
│   ├── backend-eslint.json
│   ├── eslint-summary.txt
│   ├── frontend-npm-audit.json
│   └── junit/
│
├── artifacts/                       # Build artifacts
│   ├── backend/
│   └── frontend/
│
├── app.js                           # Express app configuration
├── server.js                        # Server entry point
├── start-server.js                  # Alternative server start
├── simple-server.js                 # Simple server setup
├── start-dev.sh                     # Development startup script
│
├── package.json                     # Backend dependencies
├── jest.config.cjs                  # Jest configuration
├── eslint.config.cjs                # ESLint configuration
├── nodemon.json                     # Nodemon configuration
│
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
│
├── README.md                        # This file
├── API_DOCUMENTATION.md             # Complete API docs
├── ADMIN_GUIDE.md                   # Admin features guide
├── SECURITY_CHECKLIST.md            # Security guidelines
├── PERFORMANCE.md                   # Performance guide
├── PERFORMANCE_QUICKREF.md          # Quick performance reference
├── DOWNTIME_MONITORING.md           # Monitoring guide
├── BACKUP_RESTORE.md                # Backup/restore guide
├── POLICY_RENEWAL_GUIDE.md          # Renewal feature guide
├── HOW_TO_TEST_RENEWAL.md           # Renewal testing guide
├── FRONTEND_INTEGRATION.md          # Frontend setup guide
├── EPIC4_STORY1_IMPLEMENTATION.md   # Performance implementation
├── BRANCH_WORKFLOW.md               # Git workflow
├── BACKUP_FIXES.md                  # Backup troubleshooting
└── DIFFERENCES.md                   # Version differences
```

---

## 👥 Contributing

We welcome contributions to InsureMithra! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
4. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Coding Standards

#### Backend (JavaScript)
- Use ES6+ features
- Follow ESLint configuration
- Use async/await for asynchronous code
- Add JSDoc comments for functions
- Handle errors properly with try-catch
- Write descriptive variable names

#### Frontend (TypeScript)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use Material-UI components consistently

#### General
- Write self-documenting code
- Keep functions small and focused
- Avoid deep nesting
- Use meaningful names
- Add comments for complex logic

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(claims): add document preview functionality

- Add preview modal for claim documents
- Support PDF and image previews
- Add download functionality

Closes #123
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### Pull Request Guidelines

- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers

### Code Review Process

1. Automated checks must pass (tests, linting, security)
2. At least one approval required
3. No merge conflicts
4. Documentation updated
5. Changelog updated (if applicable)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Problem:** `MongoError: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"
```

#### 2. Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5001`

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Or change port in .env
PORT=5002
```

#### 3. Redis Connection Error

**Problem:** Cache falls back to LRU memory

**Solutions:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
# Windows (Memurai)
memurai

# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Test connection
redis-cli
> ping
PONG
```

#### 4. Email Sending Failed

**Problem:** `Error: Invalid login`

**Solutions:**
- For Gmail: Enable 2FA and create app-specific password
- Check SMTP credentials in .env
- Verify SMTP port (587 for TLS, 465 for SSL)
- Test email configuration:
  ```bash
  node scripts/test-mail.js
  ```

#### 5. JWT Token Issues

**Problem:** `Error: jwt malformed` or `TokenExpiredError`

**Solutions:**
- Clear browser localStorage/cookies
- Verify JWT_SECRET is set in .env
- Check token expiration settings
- Re-login to get fresh token

#### 6. File Upload Fails

**Problem:** `Error: File too large` or `ENOENT: no such file or directory`

**Solutions:**
- Check MAX_FILE_SIZE in .env (default 5MB)
- Ensure uploads/ directory exists and is writable
- Verify file type is allowed
- Check disk space

#### 7. Frontend Build Errors

**Problem:** `Module not found` or TypeScript errors

**Solutions:**
```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build

# Rebuild
npm run build
```

#### 8. Database Seeding Issues

**Problem:** Policies not appearing

**Solutions:**
```bash
# Seed policies
node utils/seed_policies.js

# Or upsert (update existing)
node utils/seed_policies_upsert.js

# Verify in MongoDB
mongo
> use insuremithra
> db.policies.count()
```

#### 9. Tests Failing

**Problem:** Tests timeout or fail unexpectedly

**Solutions:**
```bash
# Clear test database
rm -rf data/test

# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test tests/auth.test.js

# Increase timeout in jest.config.cjs
testTimeout: 20000
```

#### 10. Performance Issues

**Problem:** Slow API responses

**Solutions:**
- Check Redis is running for caching
- Review performance metrics: `GET /api/health/perf`
- Check database indexes are created
- Monitor slow requests in logs
- Run load tests to identify bottlenecks
  ```bash
  npm run bench:search
  npm run bench:details
  ```

### Debug Mode

Enable detailed logging:
```bash
# .env
NODE_ENV=development
DEBUG=*

# Or specific modules
DEBUG=app:*,cache:*
```

### Getting Help

1. **Check Documentation:**
   - [API Documentation](API_DOCUMENTATION.md)
   - [Admin Guide](ADMIN_GUIDE.md)
   - [Security Checklist](SECURITY_CHECKLIST.md)
   - [Performance Guide](PERFORMANCE.md)

2. **Check Logs:**
   ```bash
   # All logs
   tail -f logs/combined.log
   
   # Errors only
   tail -f logs/error.log
   
   # Specific logs
   tail -f logs/audit.log
   tail -f logs/claims.log
   tail -f logs/perf.log
   ```

3. **Enable Verbose Logging:**
   ```javascript
   // In server.js
   logger.level = 'debug';
   ```

4. **Test Individual Components:**
   ```bash
   # Test database connection
   node -e "require('./server.js')"
   
   # Test email
   node scripts/test-mail.js
   
   # Test Redis
   node -e "require('./services/cache.service').get('test')"
   ```

5. **Open an Issue:**
   If you can't resolve the issue, open a GitHub issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Environment details (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 InsureMithra Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Technologies Used
- **Backend Framework:** [Express.js](https://expressjs.com/)
- **Frontend Framework:** [React](https://reactjs.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Caching:** [Redis](https://redis.io/) / [LRU Cache](https://www.npmjs.com/package/lru-cache)
- **Authentication:** [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- **Password Hashing:** [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **File Upload:** [Multer](https://www.npmjs.com/package/multer)
- **PDF Generation:** [PDFKit](https://pdfkit.org/)
- **Logging:** [Winston](https://www.npmjs.com/package/winston)
- **UI Library:** [Material-UI](https://mui.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Testing:** [Jest](https://jestjs.io/) & [Supertest](https://www.npmjs.com/package/supertest)
- **Load Testing:** [Autocannon](https://www.npmjs.com/package/autocannon)
- **Security:** [Helmet.js](https://helmetjs.github.io/)
- **Compression:** [compression](https://www.npmjs.com/package/compression)
- **Scheduling:** [node-cron](https://www.npmjs.com/package/node-cron)

### Contributors
- **Dishan D** - Story A: User Authentication & Login
- **Dhruv Jain** - Story B: Password Reset
- **Suman Rao** - Story C: Profile Management
- **Harshaa Vardhana KV** - Story D: Role-Based Access Control

### Special Thanks
- The open-source community for amazing tools and libraries
- MongoDB University for database best practices
- Express.js community for middleware patterns
- React community for frontend patterns and best practices

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues:** [Open an issue](https://github.com/kvharsha/InsureMithra-Insurance_workflow_automation_software/issues)
- **Documentation:** Check the docs folder for detailed guides
- **Email:** insuremithra.pes@gmail.com

---

## 🗺 Roadmap

### Upcoming Features

#### Epic 5: Analytics & Reporting (Future)
- [ ] User analytics dashboard
- [ ] Policy sales reports
- [ ] Claims analytics
- [ ] Revenue tracking
- [ ] Custom report generation
- [ ] Data export functionality (CSV, Excel)

#### Epic 6: Enhanced Features (Future)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Live chat support
- [ ] Document OCR for claim processing
- [ ] AI-powered policy recommendations
- [ ] Fraud detection system
- [ ] Customer satisfaction surveys

#### Epic 7: Integration & APIs (Future)
- [ ] Third-party insurance provider integrations
- [ ] Payment gateway integrations (Stripe, Razorpay)
- [ ] SMS notifications (Twilio)
- [ ] CRM integration (Salesforce)
- [ ] Accounting software integration
- [ ] Public API for partners

#### Technical Improvements
- [ ] GraphQL API (optional)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Real-time features with WebSockets
- [ ] Advanced caching strategies
- [ ] Machine learning for risk assessment
- [ ] Blockchain for policy records (optional)

---

## 📊 System Requirements Summary

### Development
| Component | Requirement |
|-----------|-------------|
| Node.js | v16.x or higher |
| MongoDB | v4.4 or higher |
| Redis | v6.x or higher (optional) |
| RAM | 4GB minimum |
| Storage | 2GB free space |
| OS | Windows, macOS, Linux |

### Production
| Component | Requirement |
|-----------|-------------|
| Node.js | v16.x LTS or higher |
| MongoDB | v4.4+ with replication |
| Redis | v6.x or higher (recommended) |
| RAM | 8GB minimum, 16GB recommended |
| Storage | 50GB+ depending on data |
| CPU | 2+ cores recommended |
| Network | HTTPS/TLS required |
| Backup | Regular automated backups |

---

## 🔗 Quick Links

- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Admin Guide**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- **Security Checklist**: [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)
- **Performance Guide**: [PERFORMANCE.md](PERFORMANCE.md)
- **Monitoring Guide**: [DOWNTIME_MONITORING.md](DOWNTIME_MONITORING.md)
- **Backup Guide**: [BACKUP_RESTORE.md](BACKUP_RESTORE.md)
- **Renewal Guide**: [POLICY_RENEWAL_GUIDE.md](POLICY_RENEWAL_GUIDE.md)
- **Frontend Guide**: [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- **Branch Workflow**: [BRANCH_WORKFLOW.md](BRANCH_WORKFLOW.md)

---

## 📈 Project Status

**Current Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 2025

### Completed Epics
- ✅ **Epic 1:** User Authentication & Profile Management
- ✅ **Epic 2:** Policy Management & Purchase
- ✅ **Epic 3:** Claims Processing & Renewals
- ✅ **Epic 4:** Monitoring, Performance & Operations

### Test Coverage
- **Backend:** 60%+ (statements, branches, functions, lines)
- **Frontend:** Comprehensive component and integration tests
- **API Tests:** All endpoints covered
- **Performance Tests:** Load tests for critical paths
- **Security Tests:** Dependency scanning, ZAP scanning

---

**Built with ❤️ by the InsureMithra Team**

*Making insurance simple, secure, and accessible for everyone.*

---

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/insuremithra
DB_NAME=insuremithra

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
PORT=5001
NODE_ENV=development

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@insuremithra.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5
```

## 🛡️ Security Features

### Authentication
- **JWT-based authentication** with configurable expiration
- **Password hashing** using bcrypt with salt rounds
- **Account lockout** after 5 failed login attempts (15-minute lockout)
- **Rate limiting** on authentication endpoints

### Password Security
- Minimum 8 characters required
- Must contain: uppercase, lowercase, number, special character
- Secure password reset with time-limited tokens (15 minutes)
- Email verification with 24-hour token validity

### Audit Logging
- All authentication events logged
- Profile changes tracked
- Failed login attempts recorded
- Security events monitored with IP and user agent tracking

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email address
- `GET /api/auth/me` - Get current user info


### Authentication
- **JWT-based authentication** with configurable expiration
- **Password hashing** using bcrypt with salt rounds
- **Account lockout** after 5 failed login attempts (15-minute lockout)
- **Rate limiting** on authentication endpoints

### Password Security
- Minimum 8 characters required
- Must contain: uppercase, lowercase, number, special character
- Secure password reset with time-limited tokens (15 minutes)
- Email verification with 24-hour token validity

### Audit Logging
- All authentication events logged
- Profile changes tracked
- Failed login attempts recorded
- Security events monitored with IP and user agent tracking

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email address
- `GET /api/auth/me` - Get current user info

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/change-password` - Change password
- `POST /api/profile/deactivate` - Deactivate account
- `GET /api/profile/activity-log` - Get activity log (admin only)

### Admin Endpoints (New in Story 04) 🔐
- `GET /api/profile/admin/users` - Get all users with pagination (admin only)
- `GET /api/profile/admin/users/:userId` - Get specific user details (admin only)
- `PUT /api/profile/admin/users/:userId/role` - Update user role (admin only)
- `PUT /api/profile/admin/users/:userId/status` - Toggle user active status (admin only)
- `GET /api/profile/admin/stats` - Get system statistics (admin only)

### System
- `GET /api/health` - Health check

## 🔐 Role-Based Access Control

### User Roles
- **User**: Standard user with access to personal profile and insurance features
- **Admin**: Full access including user management and system statistics

### Permission Model
```javascript
// Middleware checks
authenticate()        // Verifies JWT token
requireAdmin         // Requires admin role
requireUser          // Requires user or admin role
```

### Protected Actions
- View all users → Admin only
- Change user roles → Admin only (cannot change own role)
- Deactivate users → Admin only (cannot deactivate self)
- View system stats → Admin only
- Activity logs → Admin can view any user's logs
### System
- `GET /api/health` - Health check

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/auth.test.js
```

### Test Coverage
- User registration and validation
- Login with valid/invalid credentials
- Account lockout after failed attempts
- Password reset flow
- Profile management
- Authentication middleware
- Role-based access control

## 📖 API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md` including:
- Detailed endpoint descriptions
- Request/response examples
- cURL commands for testing
- Error codes and handling
- Security considerations

## 🔄 Development Workflow

### For Developers (Dishan D)
1. **Backend Development**: Implement core authentication logic
2. **API Design**: Create RESTful endpoints with proper validation
3. **Security**: Implement JWT, password hashing, rate limiting
4. **Database**: Design user schema with proper indexing

### For Test Engineers (Dhruv Jain)
1. **Unit Tests**: Write comprehensive test cases for all endpoints
2. **Integration Tests**: Test complete authentication flows
3. **Security Tests**: Verify account lockout, rate limiting
4. **Performance Tests**: Test with multiple concurrent users

### For QA Lead (Gujjar R Suman Rao)
1. **Test Planning**: Create test scenarios for all user stories
2. **Security Testing**: Verify authentication and authorization
3. **User Acceptance**: Validate against SRS requirements
4. **Regression Testing**: Ensure no breaking changes

### For Product Owner (Harshaa Vardhana KV)
1. **Requirements Review**: Validate against SRS specifications
2. **User Stories**: Approve authentication and profile workflows
3. **Acceptance Criteria**: Verify all story requirements met
4. **Stakeholder Communication**: Coordinate with team members

## 🚀 Next Steps - Epic 2-4 Integration

This authentication module provides the foundation for:

### Epic 2: Policy Management
- **User Authentication**: Required for policy search and purchase
- **Role-Based Access**: Different permissions for users vs admins
- **Profile Integration**: User details for policy applications

### Epic 3: Claims Processing
- **Authenticated Claims**: Only verified users can file claims
- **User Context**: Claims linked to authenticated user profiles
- **Audit Trail**: Track claim submissions and updates

### Epic 4: Monitoring & Analytics
- **Admin Dashboard**: Role-based access to monitoring features
- **User Analytics**: Track user behavior and system usage
- **Security Monitoring**: Monitor authentication events and threats

## 🔧 Configuration

### Database Setup
```bash
# Start MongoDB
mongod

# Create database (automatically created on first connection)
# Database name: insuremithra
```

### Logging
- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Audit logs**: `logs/audit.log`

### Production Considerations
- Use environment variables for all secrets
- Set up proper MongoDB authentication
- Configure email service for password reset
- Set up log rotation and monitoring
- Use HTTPS in production
- Implement proper CORS configuration

## 🚀 Complete Command Reference

### Initial Setup (First Time Only)

```bash
# 1. Install backend dependencies
npm install

# 2. Install frontend dependencies
cd frontend
npm install
cd ..

# 3. Setup environment variables
cp env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start MongoDB (in a separate terminal)
mongod
```

### Development Commands

**Backend Development:**
```bash
```bash
# Start MongoDB
mongod

# Create database (automatically created on first connection)
# Database name: insuremithra
```

### Logging
- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Audit logs**: `logs/audit.log`

### Production Considerations
- Use environment variables for all secrets
- Set up proper MongoDB authentication
- Configure email service for password reset
- Set up log rotation and monitoring
- Use HTTPS in production
- Implement proper CORS configuration

## 🚀 Complete Command Reference

### Initial Setup (First Time Only)

```bash
# 1. Install backend dependencies
npm install

# 2. Install frontend dependencies
cd frontend
npm install
cd ..

# 3. Setup environment variables
cp env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start MongoDB (in a separate terminal)
mongod
```

### Development Commands

**Backend Development:**
```bash
# Start backend server with nodemon (auto-restart)
npm run dev

# Start backend server (production mode)
npm start

# Alternative: Simple server
node simple-server.js

# Run backend tests
npm test
```

**Frontend Development:**
```bash
# Start React development server
cd frontend
npm start

# Build frontend for production
npm run build

# Test frontend build
npm run build

# Run frontend tests
npm test
```

npm test
```

**Frontend Development:**
```bash
# Start React development server
cd frontend
npm start

# Build frontend for production
npm run build

# Test frontend build
npm run build

# Run frontend tests
npm test
```

### Production Deployment

**Build and Serve Frontend:**
```bash
# Build the frontend
cd frontend
npm run build

# Serve the built files (install serve globally first)
npm install -g serve
serve -s build -l 3000
```

**Backend Production:**
```bash
# Start production server
npm start
```

### Quick Start Scripts

**Option 1: Manual Start (Recommended for Development)**
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm start
```

**Option 2: Using Development Script**
```bash
# Make the script executable (Linux/Mac)
chmod +x start-dev.sh

# Run the development script
./start-dev.sh
```

### Troubleshooting Commands

**Check if services are running:**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check if backend is running
curl http://localhost:5001/api/health

# Check if frontend is running
curl http://localhost:3000
```

**Reset and Clean:**
```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clean frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Clear MongoDB database (if needed)
mongosh
use insuremithra
db.dropDatabase()
```

**View Logs:**
```bash
# View backend logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log

# View audit logs
tail -f logs/audit.log
```

### Environment Setup

**Required Environment Variables (.env file):**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/insuremithra
DB_NAME=insuremithra

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server
PORT=5001
NODE_ENV=development

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@insuremithra.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5

# Performance & Caching (Epic 4 Story 1)
REDIS_URL=redis://localhost:6379
CACHE_DEFAULT_TTL=300
CACHE_POLICY_SEARCH_TTL=60
CACHE_POLICY_DETAIL_TTL=300
ENABLE_COMPRESSION=true
```

## 🚀 Performance & Caching (Epic 4 Story 1)

InsureMithra includes comprehensive performance optimizations to ensure main user flows respond within ≤ 2 seconds.

### Features

- **Server-side caching** with Redis (automatic LRU fallback)
- **Response time profiling** and metrics
- **Gzip compression** for all responses
- **Static asset caching** with Cache-Control headers
- **Frontend code-splitting** with React.lazy
- **Image lazy loading** utilities

### Quick Setup

**1. Install Redis (Optional but Recommended)**

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 --name redis redis:alpine
```

**2. Configure Environment**

```bash
# Add to .env
REDIS_URL=redis://localhost:6379
CACHE_DEFAULT_TTL=300
CACHE_POLICY_SEARCH_TTL=60
ENABLE_COMPRESSION=true
```

**3. Run Performance Tests**

```bash
# Cache and latency tests
npm test tests/perf.cache.test.js
npm test tests/perf.latency.test.js

# Load testing
npm run bench:search
npm run bench:details
```

### Performance Monitoring

**Check performance metrics:**
```bash
curl http://localhost:5001/api/health/perf
```

**View performance logs:**
```bash
tail -f logs/perf.log
```

### Benchmarking

```bash
# Policy search benchmark (30s, 50 connections)
npm run bench:search

# Custom duration and connections
BENCH_DURATION=60 BENCH_CONNECTIONS=100 npm run bench:search

# Policy details benchmark
npm run bench:details
```

### Documentation

For detailed performance documentation, see:
- **[PERFORMANCE.md](PERFORMANCE.md)** - Complete performance guide
- **[tools/lighthouse/README.md](tools/lighthouse/README.md)** - Lighthouse testing guide

### Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Policy Search Response | ≤ 2s | ✅ |
| Policy Details Response | ≤ 2s | ✅ |
| Cache Hit Rate | > 70% | ✅ |
| Lighthouse Score | ≥ 90 | ✅ |

## 📞 Support

For technical support or questions:
- **Developer**: Dishan D
- **Test Engineer**: Dhruv Jain
- **QA Lead**: Gujjar R Suman Rao
- **Product Owner**: Harshaa Vardhana KV

## 📄 License

This project is part of the Software Engineering course at PES University.

---

**Note**: This is Epic 1 implementation. Future epics will build upon this authentication foundation to create a complete insurance workflow automation system.

