# AuraCart — Premium 3D E-Commerce Platform

A full-stack, production-quality ecommerce store with Apple-like minimal white design, 3D product animations, and comprehensive REST API backend.

![AuraCart](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop)

## 🚀 Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — Design system with custom theme tokens
- **React Three Fiber v9** + **Drei** — 3D product visualizations
- **Framer Motion** — Page transitions & micro-animations
- **GSAP** — Scroll-based animations
- **Zustand** — State management (auth, cart, UI)
- **TanStack Query** — API data fetching & caching
- **React Router v7** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Lucide React** — Icon library

### Backend
- **Java 17** + **Spring Boot 3.3**
- **Spring Data JPA** — ORM
- **Spring Security** — JWT authentication
- **PostgreSQL** — Via Supabase
- **Lombok** — Boilerplate reduction
- **Bean Validation** — Request validation

### Database
- **Supabase PostgreSQL** — Cloud database with full SQL schema

---

## 📁 Project Structure

```
auracart/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── api/       # Axios API clients
│   │   ├── components/
│   │   │   ├── layout/   # Navbar, Footer, Layout
│   │   │   └── three/    # 3D components (HeroScene, ProductViewer)
│   │   ├── features/
│   │   │   ├── cart/     # Cart drawer
│   │   │   └── products/ # Product card
│   │   ├── lib/       # Animation utilities
│   │   ├── pages/     # All 8 pages
│   │   ├── store/     # Zustand stores
│   │   └── types/     # TypeScript interfaces
│   └── ...
├── backend/           # Spring Boot REST API
│   └── src/main/java/com/auracart/
│       ├── config/    # JWT, Security, CORS
│       ├── controller/ # REST endpoints
│       ├── dto/       # Request/Response DTOs
│       ├── entity/    # JPA entities (11)
│       ├── exception/ # Global error handling
│       ├── repository/ # JPA repositories
│       ├── service/   # Business logic
│       └── seed/      # Data seeder
├── database/
│   └── schema.sql     # Full PostgreSQL schema + seed data
└── README.md
```

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.9+
- Supabase account (free tier works)

### 1. Database Setup (Supabase)

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `database/schema.sql`
3. Run the SQL to create all tables and seed data
4. Go to **Settings > Database** to get your connection string

### 2. Backend Setup

```bash
cd backend

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Build and run
mvn spring-boot:run
```

The API starts at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env

# Start dev server
npm run dev
```

The app opens at `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@auracart.com  | Admin@123  |
| User  | user@auracart.com   | User@123   |

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | List products (paginated, filtered) |
| GET | `/api/products/{slug}` | Product details |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/categories` | All categories |

### Authenticated User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Current user |
| GET/POST/PUT/DELETE | `/api/cart/**` | Cart operations |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | User's orders |
| POST/DELETE | `/api/wishlist/**` | Wishlist |
| POST | `/api/products/{id}/reviews` | Submit review |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/api/admin/products/**` | Product CRUD |
| POST/PUT/DELETE | `/api/admin/categories/**` | Category CRUD |
| GET/PATCH | `/api/admin/orders/**` | Order management |

---

## 🚢 Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Backend → Render

1. Push `backend/` to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set build command: `mvn clean package -DskipTests`
4. Set start command: `java -jar target/*.jar`
5. Add environment variables from `.env.example`

### Database → Supabase

Already configured as a cloud database. Just ensure:
- Connection pooling is enabled (Session Pooler)
- IP allowlist includes Render's outgoing IPs (or set to `0.0.0.0/0`)

---

## ✨ Design Features

- **Pure white background** everywhere — Apple/Tesla-inspired
- **3D floating product** in hero section with mouse parallax
- **Interactive 3D product viewer** with orbit controls and color switching
- **Smooth page transitions** with Framer Motion
- **Product cards** with hover lift, shadow expansion, and mouse-based tilt
- **Animated cart drawer** sliding from right with backdrop blur
- **Glass morphism navbar** with animated cart count
- **Stagger animations** on product grids
- **Scroll-based parallax** on hero section
- **Premium typography** with Plus Jakarta Sans
- **Fully responsive** — mobile, tablet, desktop

---

## 📄 License

MIT
