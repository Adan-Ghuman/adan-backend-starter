# 🚀 How to Use This Template

Hey! So you want to build a backend API? You're in the right place. This guide will show you exactly how to use everything in this template.

## 🎬 Getting Started

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Copy the environment file
cp .env.example .env

# Edit .env and add your MongoDB URL and secrets
# (Use the command below to generate secrets)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Run the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running on port 5000
```

### 3. Test It Works
Open your browser or Postman and hit:
```
GET http://localhost:5000/api/health
```

You'll get:
```json
{
  "status": "ok",
  "uptime": 12.345
}
```

Cool! Your server is running. Now let's build something.

---

## 📝 Building Your First Feature

Let's say you want to build a blog. Here's how you'd add a "Post" feature.

### Step 1: Create the Model

Create `src/models/post.model.ts`:
```typescript
import { Schema, Document, model } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: Date;
}

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const PostModel = model<IPost>("Post", postSchema);
```

### Step 2: Create the Repository

Create `src/repositories/post.repository.ts`:
```typescript
import { PostModel, IPost } from "../models/post.model";

export const PostRepository = {
  async findAll(): Promise<IPost[]> {
    return PostModel.find().lean<IPost[]>().exec();
  },

  async findById(id: string): Promise<IPost | null> {
    return PostModel.findById(id).lean<IPost>().exec();
  },

  async create(data: Partial<IPost>): Promise<IPost> {
    return PostModel.create(data);
  },

  async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
    return PostModel.findByIdAndUpdate(id, data, { new: true }).lean<IPost>().exec();
  },

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id);
    return !!result;
  },
};
```

### Step 3: Create the Service

Create `src/services/post.service.ts`:
```typescript
import { PostRepository } from "../repositories/post.repository";
import { NotFoundError } from "../utils/ApiError";

export const PostService = {
  async getAllPosts() {
    return PostRepository.findAll();
  },

  async getPostById(id: string) {
    const post = await PostRepository.findById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  },

  async createPost(data: { title: string; content: string; author: string }) {
    return PostRepository.create(data);
  },

  async updatePost(id: string, data: Partial<{ title: string; content: string }>) {
    const post = await PostRepository.update(id, data);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  },

  async deletePost(id: string) {
    const deleted = await PostRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Post not found");
    }
  },
};
```

### Step 4: Create the Controller

Create `src/controllers/post.controller.ts`:
```typescript
import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PostService } from "../services/post.service";

export const PostController = {
  getAll: AsyncHandler(async (_req: Request, res: Response) => {
    const posts = await PostService.getAllPosts();
    ApiResponse.success(res, "Posts fetched successfully", posts);
  }),

  getById: AsyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.getPostById(req.params.id);
    ApiResponse.success(res, "Post fetched successfully", post);
  }),

  create: AsyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.createPost(req.body);
    ApiResponse.created(res, "Post created successfully", post);
  }),

  update: AsyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.updatePost(req.params.id, req.body);
    ApiResponse.updated(res, "Post updated successfully", post);
  }),

  delete: AsyncHandler(async (req: Request, res: Response) => {
    await PostService.deletePost(req.params.id);
    ApiResponse.deleted(res, "Post deleted successfully");
  }),
};
```

### Step 5: Create Validation (Optional but Recommended)

Create `src/validators/post.validator.ts`:
```typescript
import { z } from "zod";

export const CreatePostValidator = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  author: z.string().min(2, "Author name is required"),
});

export const UpdatePostValidator = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
});
```

### Step 6: Create Routes

Create `src/routes/post.route.ts`:
```typescript
import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { zodValidator } from "../middlewares/validator.middleware";
import { CreatePostValidator, UpdatePostValidator } from "../validators/post.validator";

const router = Router();

router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);
router.post("/", zodValidator(CreatePostValidator), PostController.create);
router.put("/:id", zodValidator(UpdatePostValidator), PostController.update);
router.delete("/:id", PostController.delete);

export default router;
```

### Step 7: Register Routes in app.ts

Open `src/app.ts` and add:
```typescript
import postRoutes from "./routes/post.route";

// Add this line after other routes
app.use(`${ENV.apiPrefix}/posts`, postRoutes);
```

Done! Restart your server and test it.

---

## 🧪 Testing Your API

### Create a Post
```bash
POST http://localhost:5000/api/v1/posts
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post. It's pretty cool!",
  "author": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65abc123def456",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post. It's pretty cool!",
    "author": "John Doe",
    "published": false,
    "createdAt": "2025-10-17T10:30:00.000Z"
  },
  "statusCode": 201
}
```

### Get All Posts
```bash
GET http://localhost:5000/api/v1/posts
```

**Response (200):**
```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [
    {
      "_id": "65abc123def456",
      "title": "My First Blog Post",
      "content": "This is the content of my blog post. It's pretty cool!",
      "author": "John Doe",
      "published": false,
      "createdAt": "2025-10-17T10:30:00.000Z"
    }
  ],
  "statusCode": 200
}
```

### Get Single Post
```bash
GET http://localhost:5000/api/v1/posts/65abc123def456
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "_id": "65abc123def456",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post. It's pretty cool!",
    "author": "John Doe",
    "published": false,
    "createdAt": "2025-10-17T10:30:00.000Z"
  },
  "statusCode": 200
}
```

### Update a Post
```bash
PUT http://localhost:5000/api/v1/posts/65abc123def456
Content-Type: application/json

{
  "title": "My Updated Blog Post"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "65abc123def456",
    "title": "My Updated Blog Post",
    "content": "This is the content of my blog post. It's pretty cool!",
    "author": "John Doe",
    "published": false,
    "createdAt": "2025-10-17T10:30:00.000Z"
  },
  "statusCode": 200
}
```

### Delete a Post
```bash
DELETE http://localhost:5000/api/v1/posts/65abc123def456
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "statusCode": 200
}
```

---

## 🚨 Error Handling

The template handles errors automatically. You just need to throw them!

### Example: Post Not Found
```bash
GET http://localhost:5000/api/v1/posts/invalid-id
```

**Response (404):**
```json
{
  "success": false,
  "message": "Post not found",
  "code": "NOT_FOUND",
  "statusCode": 404
}
```

### Example: Validation Error
```bash
POST http://localhost:5000/api/v1/posts
Content-Type: application/json

{
  "title": "Hi",
  "content": "Short"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Title must be at least 5 characters",
  "code": "VALIDATION_ERROR",
  "statusCode": 400
}
```

### Example: Too Many Requests
If you hit the API more than 100 times in 15 minutes:

**Response (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "code": "TOO_MANY_REQUESTS",
  "statusCode": 429
}
```

---

## 🎯 Common Patterns

### Throwing Errors in Your Code

```typescript
// Service layer
const post = await PostRepository.findById(id);
if (!post) {
  throw new NotFoundError("Post not found");
}

// Validation
if (user.role !== "admin") {
  throw new ForbiddenError("Only admins can do this");
}

// Authentication
if (!token) {
  throw new UnauthorizedError("Please login first");
}

// Bad input
if (!email || !password) {
  throw new BadRequestError("Email and password are required");
}
```

### Sending Responses

```typescript
// Success with data
ApiResponse.success(res, "Here's your data", someData);

// Created something new
ApiResponse.created(res, "Post created", newPost);

// Updated something
ApiResponse.updated(res, "Profile updated", updatedProfile);

// Deleted something
ApiResponse.deleted(res, "Post deleted");
```

---

## 🔧 Useful Commands

```bash
# Development (hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Seed database
npm run seed
```

---

## 📂 File Organization Cheat Sheet

When adding a new feature (e.g., "users"):

```
src/
├── models/
│   └── user.model.ts          # Database schema
├── repositories/
│   └── user.repository.ts     # Database queries
├── services/
│   └── user.service.ts        # Business logic
├── controllers/
│   └── user.controller.ts     # Handle requests
├── validators/
│   └── user.validator.ts      # Input validation
├── routes/
│   └── user.route.ts          # URL mappings
└── types/
    └── user.type.ts           # TypeScript types
```

Then register the route in `src/app.ts`:
```typescript
import userRoutes from "./routes/user.route";
app.use(`${ENV.apiPrefix}/users`, userRoutes);
```

---

## 💡 Pro Tips

1. **Always use AsyncHandler** - It catches errors automatically
   ```typescript
   // Good ✅
   AsyncHandler(async (req, res) => { ... })
   
   // Bad ❌ (you'll have to handle errors manually)
   async (req, res) => { ... }
   ```

2. **Throw errors, don't return them**
   ```typescript
   // Good ✅
   throw new NotFoundError("User not found");
   
   // Bad ❌
   return res.status(404).json({ error: "Not found" });
   ```

3. **Keep controllers thin**
   ```typescript
   // Controller just calls service and sends response
   const data = await SomeService.getData();
   ApiResponse.success(res, "Got data", data);
   ```

4. **Business logic goes in services**
   ```typescript
   // Check permissions, validate data, make decisions
   if (user.role !== "admin") throw new ForbiddenError();
   ```

5. **Database queries only in repositories**
   ```typescript
   // Just talk to the database, nothing else
   return UserModel.find().lean().exec();
   ```

---

## 🐛 Debugging

Check the logs folder:
- `logs/error.log` - All errors
- `logs/combined.log` - Everything

In development, you'll also see colored logs in the console.

---

## 🎓 Learning Path

1. Start by looking at the example files (example.controller.ts, etc.)
2. Copy the pattern for your first feature
3. Add validation with Zod
4. Test with Postman/Thunder Client
5. Check the logs to see what's happening
