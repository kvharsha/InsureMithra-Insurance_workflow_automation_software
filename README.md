# InsureMithra - Insurance Workflow Automation System

## Epic 1: User Authentication & Profile Management

A comprehensive MERN stack application for user authentication and profile management in the InsureMithra Insurance Workflow Automation System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and setup Backend**
```bash
cd InsureMithra
npm install
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Environment Configuration**
```bash
# Backend environment
cp env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

## 🏃‍♂️ Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend Server:**
```bash
# Start the backend server
npm run dev
# OR
npm start
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm start
```

### Option 2: Run with Development Scripts

**Start Backend:**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Simple server (alternative)
node simple-server.js
```

**Start Frontend:**
```bash
cd frontend
npm start
```

### Option 3: Build and Serve Frontend

**Build Frontend for Production:**
```bash
cd frontend
npm run build
```

**Serve Built Frontend:**
```bash
cd frontend
# Install serve globally if not already installed
npm install -g serve

# Serve the built files
serve -s build
```

## 🌐 Application URLs

- **Backend API**: http://localhost:5001
- **Frontend Development**: http://localhost:3000
- **Frontend Production**: http://localhost:3000 (after build)

## 🧪 Testing

**Backend Tests:**
```bash
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

**Frontend Build Test:**
```bash
cd frontend
npm run build
```

## 📁 Project Structure

```
InsureMithra/
├── config/
│   └── logger.js              # Winston logging configuration
├── controllers/
│   ├── auth.controller.js     # Authentication logic
│   └── profile.controller.js  # Profile management logic
├── middleware/
│   └── auth.js               # JWT & role-based middleware
├── models/
│   └── user.model.js         # User Mongoose schema
├── routes/
│   ├── auth.routes.js        # Authentication routes
│   └── profile.routes.js     # Profile management routes
├── tests/
│   └── auth.test.js          # Jest test suite
├── logs/                     # Log files (created automatically)
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── services/        # API services
│   │   └── config/          # Frontend configuration
│   ├── package.json
│   └── README.md
├── server.js                 # Express server setup
├── simple-server.js         # Alternative server setup
├── start-dev.sh            # Development startup script
├── start-server.js         # Production startup script
├── package.json
├── env.example             # Environment variables template
├── API_DOCUMENTATION.md    # Complete API documentation
├── FRONTEND_INTEGRATION.md # Frontend integration guide
└── README.md
```

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

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/change-password` - Change password
- `POST /api/profile/deactivate` - Deactivate account
- `GET /api/profile/activity-log` - Get activity log (admin only)

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
```

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

