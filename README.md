# 🚀 Backend Starter Template

A production-ready Node.js + TypeScript + Express + MongoDB backend starter template with best practices and essential features pre-configured.

**👉 [Read the Usage Guide (USAGE.md)](./USAGE.md) to get started quickly!**

**📚 [Check out detailed examples (USAGE_EXAMPLES.md)](./USAGE_EXAMPLES.md) for advanced patterns.**

## ✨ Features

- 🔒 **Security**: Helmet, CORS, Rate Limiting
- 🔐 **Authentication Ready**: JWT configuration (implementation needed)
- 📝 **Logging**: Winston with file and console transports
- ✅ **Validation**: Zod for runtime validation
- 🗄️ **Database**: MongoDB with Mongoose
- 🏗️ **Architecture**: Clean layered architecture (Controller → Service → Repository → Model)
- 🔥 **Error Handling**: Centralized error handling
- 🎯 **TypeScript**: Full type safety
- 🔄 **Hot Reload**: Development with ts-node-dev
- 🧪 **Production Ready**: Build and deployment scripts

## 📦 Project Structure

```
src/
├── config/          # Configuration files (DB, ENV)
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
│   └── rateLimiters/
├── models/          # Database models
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types/interfaces
├── utils/           # Utility functions
├── validators/      # Zod schemas
├── seeds/           # Database seeders
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- npm 

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd adan-backend-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your values:
   - `MONGO_URI`: Your MongoDB connection string
   - `ACCESS_TOKEN_SECRET`: Random 32+ character string
   - `REFRESH_TOKEN_SECRET`: Different random 32+ character string
   - `AWS_*`: AWS credentials (if using S3)
   - `CLIENT_URL`: Your frontend URL

4. **Generate Secrets** (optional)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Example Routes
```
GET /api/v1/examples
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

### Required Variables:
- `MONGO_URI` - MongoDB connection string
- `ACCESS_TOKEN_SECRET` - JWT access token secret
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret
- `CLIENT_URL` - Frontend URL for CORS

### Optional Variables:
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `LOG_LEVEL` (default: debug)
- `API_PREFIX` (default: /api/v1)

## 🏗️ Architecture Patterns

### Controller → Service → Repository → Model

1. **Controllers**: Handle HTTP requests/responses
2. **Services**: Business logic
3. **Repositories**: Data access abstraction
4. **Models**: Database schemas

### Example Flow:
```typescript
// 1. Route
router.get('/', ExampleController.getExample);

// 2. Controller
const data = await ExampleService.getExampleData();

// 3. Service
return ExampleRepository.findAll();

// 4. Repository
return ExampleModel.find().lean().exec();
```

## 🔒 Security Features

- **Helmet**: Secure HTTP headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: 
  - API: 100 requests per 15 minutes
  - Auth: 5 requests per 5 minutes
- **Input Validation**: Zod schemas
- **Environment Validation**: Startup validation of env vars

## 🧪 Adding New Features

### 1. Create a Model
```typescript
// src/models/user.model.ts
```

### 2. Create a Repository
```typescript
// src/repositories/user.repository.ts
```

### 3. Create a Service
```typescript
// src/services/user.service.ts
```

### 4. Create a Controller
```typescript
// src/controllers/user.controller.ts
```

### 5. Create Routes
```typescript
// src/routes/user.route.ts
```

### 6. Register Routes in app.ts
```typescript
import userRoutes from './routes/user.route';
app.use(`${ENV.apiPrefix}/users`, userRoutes);
```

## 📝 Error Handling

All errors are handled centrally. Use the `ApiError` class:

```typescript
throw new ApiError(400, "Bad request", "BAD_REQUEST");
// Or use specific error classes
throw new NotFoundError("User not found");
```

## 🔄 Response Format

Success responses:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "statusCode": 200
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## 📊 Logging

Logs are written to:
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs
- Console (development only)


## 🤝 Contributing

Feel free to extend this template for your projects!

**Made with ❤️ for rapid backend development**
