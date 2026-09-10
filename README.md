# 🍽️ Zaytouna Restaurant

A modern restaurant ordering and reservation application built with **React**, featuring JWT authentication, role-based access control, menu browsing, online orders, reservations, and an admin dashboard.

## ✨ Features

- 🔐 JWT-based authentication
- 👥 Role-based access control
- 🍽️ Browse restaurant menu
- 🛒 Create and manage orders
- 📅 Make and manage reservations
- 👤 User profile management
- 🛡️ Protected routes
- 📊 Admin dashboard
- 🌍 Arabic / English internationalization
- 📱 Responsive design
- 🎨 Modern UI with shadcn/ui
- ⚡ Fast development with Vite

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19+** | UI library |
| **Vite 8** | Build tool and development server |
| **JavaScript** | Application language |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI components |
| **React Router v7** | Routing |
| **Axios** | HTTP client |
| **Lucide React** | Icons |
| **i18next** | Internationalization |
| **react-i18next** | React integration for i18next |

### Backend

- **Node.js**
- **Express.js**
- **JWT Authentication**
- REST API

> The backend is already available in the `backend/` directory.

---

## 📁 Project Structure

```text
zaytouna-restaurant/
│
├── public/
│   └── Static assets
│
├── src/
│   ├── api/
│   │   ├── axiosClient.js
│   │   ├── authApi.js
│   │   ├── menuApi.js
│   │   └── ordersApi.js
│   │
│   ├── assets/
│   │   └── Images, fonts, and other assets
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   └── shadcn/ui components
│   │   ├── layouts/
│   │   │   └── Layout components
│   │   └── Reusable application components
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   │
│   ├── hooks/
│   │   └── Custom React hooks
│   │
│   ├── i18n/
│   │   ├── index.js
│   │   └── locales/
│   │       ├── ar.json
│   │       └── en.json
│   │
│   ├── lib/
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   └── Public pages
│   │   ├── auth/
│   │   │   └── Authentication pages
│   │   ├── user/
│   │   │   └── Logged-in user pages
│   │   └── admin/
│   │       └── Admin pages
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleGuard.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── backend/
│   └── Express REST API
│
├── docs/
│   └── Project documentation
│
├── components.json
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- **Node.js 20+**
- **npm**

Check your versions:

```bash
node --version
npm --version
```

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd zaytouna-restaurant
```

Install frontend dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

> Adjust the API URL according to your backend configuration.

Never commit your `.env` file if it contains secrets.

---

## ▶️ Running the Application

Start both the frontend and the backend together:

```bash
npm start
```

This runs the Express API on `http://localhost:5000` and the Vite dev server on `http://localhost:5173`.

A standalone frontend dev server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Create the backend environment file:

```bash
.env
```

Configure the required environment variables according to the backend documentation.

Start the backend server:

```bash
npm run dev
```

---

## 🎨 shadcn/ui

This project uses **shadcn/ui** for reusable UI components.

Components are stored in:

```text
src/components/ui/
```

To add a new component:

```bash
npx shadcn@latest add <component>
```

For example:

```bash
npx shadcn@latest add button
```

---

## 🌍 Internationalization

The application supports multiple languages using **i18next** and **react-i18next**.

Currently supported languages:

- 🇪🇬 Arabic
- 🇬🇧 English

Translations are located in:

```text
src/i18n/locales/
```

Example:

```text
src/i18n/locales/ar.json
src/i18n/locales/en.json
```

---

## 🔐 Authentication & Authorization

Authentication is handled using **JWT**.

The application supports role-based access control, allowing different permissions for different user roles.

Example roles:

```text
User
Admin
```

Protected pages require authentication, while admin pages additionally require the appropriate role.

---

## 🛣️ Routing

Routing is handled using **React Router v7**.

Example route structure:

```text
/
├── /
├── /menu
├── /login
├── /register
│
├── /dashboard
├── /orders
├── /reservations
└── /admin
```

Protected routes are handled through authentication and authorization guards.

---

## 🌐 API Layer

API communication is handled through **Axios**.

The main Axios instance is located at:

```text
src/api/axiosClient.js
```

Feature-specific API wrappers live in `src/api/` (`authApi.js`, `menuApi.js`, `ordersApi.js`).

The API layer is responsible for:

- Base URL configuration
- JWT authorization headers
- Request handling
- Response handling
- Authentication errors
- API error handling

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📌 Development Guidelines

### Components

Keep reusable components inside:

```text
src/components/
```

shadcn/ui components should remain inside:

```text
src/components/ui/
```

### Pages

Route-level components belong in:

```text
src/pages/
```

### API Services

Keep API requests separated from UI components:

```text
src/api/
```

### Routes

Route protection and authorization lives in:

```text
src/routes/
```

### Utilities

Shared helper functions belong in:

```text
src/lib/
```

---

## 🔒 Security Notes

- Do not commit `.env` files containing secrets.
- Never expose backend secrets through `VITE_*` environment variables.
- Validate authentication on the backend as well as the frontend.
- Do not rely on frontend role checks as the only authorization mechanism.
- Handle expired JWT tokens gracefully.

---

## 📄 License

This project is for educational and/or development purposes.

---

## 👨‍💻 Author

**Zaytouna Restaurant Team**