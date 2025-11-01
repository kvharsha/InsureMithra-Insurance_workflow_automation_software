# InsureMithra API Documentation

## Overview
This document provides comprehensive API documentation for the InsureMithra Insurance Workflow Automation System - Epic 1: User Authentication & Profile Management.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [] // Optional: validation errors
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isEmailVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "verificationToken": "abc123def456..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

### 2. Login User
**POST** `/auth/login`

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isEmailVerified": false,
    "lastLogin": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

### 3. Logout User
**POST** `/auth/logout`

Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Forgot Password
**POST** `/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com"}'
```

### 5. Reset Password
**POST** `/auth/reset-password`

Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email",
    "password": "NewSecurePassword123!"
  }'
```

### 6. Verify Email
**GET** `/auth/verify-email/:token`

Verify user email address.

**Response (200):**
```json
{
  "message": "Email verified successfully."
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/verify-email/verification-token
```

### 7. Get Current User
**GET** `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Profile Management Endpoints

### 1. Get Profile
**GET** `/profile`

Get user profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Update Profile
**PUT** `/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "Johnny",
  "phone": "+1234567891",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210"
  }
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully.",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "Johnny",
    "lastName": "Doe",
    "fullName": "Johnny Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567891",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    },
    "role": "user",
    "isEmailVerified": true,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "phone": "+1234567891"
  }'
```

### 3. Change Password
**POST** `/profile/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/profile/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword123!"
  }'
```

### 4. Deactivate Account
**POST** `/profile/deactivate`

Deactivate user account.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "password": "CurrentPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Account deactivated successfully."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/profile/deactivate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"password": "CurrentPassword123!"}'
```

### 5. Get Activity Log (Admin Only)
**GET** `/profile/activity-log`

Get user activity log (admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**
```json
{
  "message": "Activity log feature will be implemented in the monitoring module.",
  "note": "This endpoint is reserved for future implementation of user activity tracking."
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/profile/activity-log \
  -H "Authorization: Bearer <admin-jwt-token>"
```

---

## Health Check

### Health Check
**GET** `/health`

Check API health status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "InsureMithra API",
  "version": "1.0.0"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/health
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `NO_TOKEN` | No authentication token provided |
| `INVALID_TOKEN` | Invalid or malformed token |
| `TOKEN_EXPIRED` | Token has expired |
| `ACCOUNT_LOCKED` | Account is temporarily locked |
| `ACCOUNT_DEACTIVATED` | Account is deactivated |
| `USER_EXISTS` | User already exists with email |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `INVALID_RESET_TOKEN` | Invalid or expired reset token |
| `INVALID_VERIFICATION_TOKEN` | Invalid or expired verification token |
| `INVALID_CURRENT_PASSWORD` | Current password is incorrect |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `EMAIL_NOT_VERIFIED` | Email verification required |

---

## Rate Limiting

Authentication endpoints are rate-limited:
- **Window**: 15 minutes
- **Max Attempts**: 5 requests per IP
- **Lockout**: Account locked for 15 minutes after 5 failed attempts

---

## Security Features

1. **Password Requirements**:
   - Minimum 8 characters
   - Must contain uppercase, lowercase, number, and special character

2. **Account Security**:
   - Account lockout after 5 failed login attempts
   - 15-minute lockout period
   - Password reset tokens expire in 15 minutes
   - Email verification tokens expire in 24 hours

3. **JWT Security**:
   - Tokens expire in 7 days (configurable)
   - Secure token generation with secret key
   - Token validation on protected routes

4. **Audit Logging**:
   - All authentication events logged
   - Profile changes tracked
   - Failed login attempts recorded
   - Security events monitored

---

## Next Steps for Epic 2-4

This authentication module provides the foundation for:

1. **Epic 2 - Policy Management**: User authentication required for policy search, comparison, and purchase
2. **Epic 3 - Claims Processing**: Authenticated users can file and track claims
3. **Epic 4 - Monitoring & Analytics**: Admin users can access monitoring dashboards

The JWT tokens and user roles established here will be used across all subsequent modules.
