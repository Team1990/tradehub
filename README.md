# TradeHub - B2B Commerce OS

IndiaMART-style B2B marketplace built with modular Clean Architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express, TypeScript, Prisma ORM, Zod |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT + bcrypt |

## Modules

- Auth (multi-tenant: BUYER/SELLER/ADMIN)
- Catalog (products, categories, brands, reviews)
- Inventory & Warehousing (stock tracking, locations, transactions)
- Orders (buyer orders, supplier orders, customers, invoices)
- Quotation (RFQ/inquiries, quotes, messaging)
- Manufacturing (BOM, assembly)
- Analytics (dashboard stats, product analytics, sales)
- AI (demand forecast, price suggestions, auto-categorize)

---

## Deployment

### Option A: Render (simplest, $0/mo)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Manual steps:**

1. Push to GitHub
2. Go to https://render.com → New → **Blueprint**
3. Connect repo — `render.yaml` auto-configures everything
4. Set `DATABASE_URL` from the created PostgreSQL instance
5. Deploy — done

Or create manually:

| Step | Detail |
|------|--------|
| **Web Service** | Name: `tradehub`, Plan: **Free**, Region: Singapore |
| **Build Command** | `cd backend && npm install && npx prisma generate && npm run build && cd ../frontend && npm install && npm run build` |
| **Start Command** | `cd backend && npx prisma migrate deploy && node dist/index.js` |
| **PostgreSQL** | Create free DB, copy internal connection string |
| **Env Vars** | `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` |

> **Free tier note:** Web service sleeps after 15min idle. Wakes on next request (takes ~5s).

### Option B: Fly.io (no sleep, $0/mo)

```bash
# 1. Install flyctl
# Windows: winget install Fly-io.flyctl
# Mac: brew install flyctl

# 2. Login
fly auth login

# 3. Launch (creates app + PostgreSQL)
fly launch --no-deploy

# 4. Create database
fly postgres create --name tradehub-db
fly postgres attach tradehub-db

# 5. Set secrets
fly secrets set JWT_SECRET=$(openssl rand -hex 32)
fly secrets set CORS_ORIGIN=https://tradehub.fly.dev

# 6. Deploy
fly deploy

# 7. Open
fly open
```

> **Free tier:** 3 shared-CPU VMs, 256MB each, 3GB storage. No sleep. 160hrs/month total across all VMs.

---

## Local Development

```bash
# Install
cd backend && npm install
cd ../frontend && npm install

# Database
cd backend
cp .env.example .env
npx prisma migrate dev
npx prisma db seed

# Start both servers
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

### Test accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Seller | seller@example.com | admin123 |
| Buyer | buyer@example.com | admin123 |

---

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `GET/PATCH /api/auth/profile`, `GET/PUT /api/auth/company` |
| **Products** | `GET /api/products`, `GET /api/products/:id`, `POST/PATCH/DELETE /api/products/:id` (seller), `GET /api/products/my` |
| **Categories** | `GET /api/categories`, `GET /api/categories/:id` |
| **Inquiries** | `POST /api/inquiries`, `GET /api/inquiries/my`, `GET /api/inquiries/received`, `PATCH /api/inquiries/:id/status` |
| **Quotes** | `POST /api/quotes`, `GET /api/inquiries/:inquiryId/quotes` |
| **Messages** | `GET /api/messages/:inquiryId`, `POST /api/messages/:inquiryId` |
| **Reviews** | `GET /api/reviews/:productId`, `POST /api/reviews/:productId` |
| **Inventory** | `GET /api/inventory`, `GET /api/inventory/low-stock`, `GET /api/inventory/product/:productId`, `PATCH /api/inventory/product/:productId` |
| **Warehouses** | `GET /api/inventory/warehouses`, `POST /api/inventory/warehouses`, `GET /api/inventory/warehouses/:id` |
| **Stock Txns** | `GET /api/inventory/transactions`, `POST /api/inventory/transactions` |
| **Orders** | `POST /api/orders`, `GET /api/orders`, `GET /api/orders/supplier`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status` |
| **Customers** | `GET /api/orders/customers`, `POST /api/orders/customers` |
| **Invoices** | `GET /api/orders/invoices`, `POST /api/orders/invoices` |
| **Manufacturing** | `GET /api/manufacturing`, `POST /api/manufacturing`, `GET /api/manufacturing/:id`, `POST /api/manufacturing/assemble` |
| **Analytics** | `GET /api/analytics/dashboard`, `GET /api/analytics/products`, `GET /api/analytics/customers`, `GET /api/analytics/sales` |
| **AI** | `GET /api/ai/demand-forecast`, `GET /api/ai/price-suggestions`, `POST /api/ai/auto-categorize` |

## Deployment Files

| File | Purpose |
|------|---------|
| `render.yaml` | Render Blueprint — one-click deploy |
| `fly.toml` | Fly.io configuration |
| `Dockerfile` | Multi-stage Docker build (frontend + backend) |
| `.dockerignore` | Docker build exclusions |
