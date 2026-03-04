# Habit Tracker - Frontend 🎯

A modern React 18 application for tracking daily, weekly, and monthly habits with real-time statistics and competitive rankings.

This project is the frontend client of the Habit Tracker full-stack application, built with a REST API backend using JWT authentication.

**Backend Repository:** [Habit Tracker API](https://github.com/christo256/S5.02-Web-Application-Habit-Tracker)

---

## 🚀 Technologies

- **React 18**
- **JavaScript (ES6+)**
- **React Router v6** for client-side routing
- **Axios** for HTTP requests
- **Tailwind CSS 3.4.19** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Canvas Confetti** for celebrations
- **Node.js 20.20.0 LTS**
- **npm** for package management

---

## ✨ Features

### Authentication

- User registration and login
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes with redirect to login

### User Dashboard

- View all personal habits
- Real-time statistics cards:
  - Total habits
  - Completed today
  - Current streak sum
  - Best streak
- Create new habits with frequency selection (DAILY/WEEKLY/MONTHLY)
- Complete habits with one click
- Delete habits with confirmation
- Confetti celebration every 7-day streak milestone

### Rankings

- Separate leaderboards for each frequency type
- Top 10 habits per category (DAILY/WEEKLY/MONTHLY)
- Medal icons for top 3 positions
- Current and longest streak display

### Admin Panel (ROLE_ADMIN only)

- View all users in the system
- View all habits from all users
- Delete users (except other admins)
- Global statistics

### Design

- Modern glassmorphism UI
- Dark theme with gradient background
- Smooth animations and transitions
- Responsive layout
- Color-coded frequency badges (green/cyan/purple)

---

## 🗂️ Project Structure
```
habit-tracker-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CreateHabitModal.jsx    # Modal for creating habits
│   │   ├── HabitCard.jsx           # Individual habit display
│   │   ├── Navbar.jsx              # Navigation bar
│   │   └── ProtectedRoute.jsx      # Route protection HOC
│   ├── pages/
│   │   ├── AdminPanel.jsx          # Admin dashboard
│   │   ├── Dashboard.jsx           # User dashboard
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   └── Rankings.jsx            # Rankings page
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── services/
│   │   └── api.js                  # Axios configuration and API calls
│   ├── App.js                      # Main app component with routing
│   ├── index.js                    # React entry point
│   └── index.css                   # Global styles and Tailwind
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js 20.20.0 LTS** or higher
- **npm** (comes with Node.js)
- **Backend API** running on http://localhost:8080

### Steps
```bash
# Clone the repository
git clone https://github.com/christo256/S5.02-Web-Application-Habit-Tracker-Frontend.git
cd S5.02-Web-Application-Habit-Tracker-Frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will start on **http://localhost:3000**

---

## ⚙️ Configuration

### API Base URL

The frontend connects to the backend at `http://localhost:8080/api` by default.

To change the API URL, edit `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api' // Change this if needed
});
```

---

## 🔑 Default Credentials
```
Admin User:
  Username: admin
  Password: admin123
  Role: ROLE_ADMIN
```

---

## 📱 Pages & Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/login` | Login | Public | User login |
| `/register` | Register | Public | User registration |
| `/dashboard` | Dashboard | Protected | User's habits and stats |
| `/rankings` | Rankings | Protected | Leaderboards by frequency |
| `/admin` | AdminPanel | Admin only | User and habit management |

---

## 🏗️ Architecture

- **Context API** for global authentication state management
- **Axios service layer** for centralized API calls with JWT interceptor
- **Protected routes** with role-based access control (USER/ADMIN)
- **Component-based** structure for reusability

---

## 🎯 Usage Flow

### 1. Login

Navigate to http://localhost:3000/login and login with `admin/admin123`

### 2. Create a Habit

- Click "Nuevo Hábito" button
- Fill in name, description, frequency (DAILY/WEEKLY/MONTHLY), and target count
- Click "Crear Hábito"

### 3. Complete a Habit

- Click "Completar Hoy" button on any habit card
- Streak updates automatically
- Confetti celebration on 7-day milestones! 🎉

### 4. View Rankings

Navigate to "Rankings" to see top 10 habits in each frequency category.

**Note:** Habits can only be completed once per day.

---


## 🧪 Testing

### Backend

Make sure the backend is running on http://localhost:8080.

You can run it using Docker:

```bash
docker-compose up -d
```
Or locally with Maven:
```bash
mvn spring-boot:run
```

Access http://localhost:3000 and test all features.

---

## 🐛 Troubleshooting

- Make sure backend is running on http://localhost:8080
- Check token expiration if you receive 401 errors

---


## 🚀 Build for Production
```bash
# Create optimized production build
npm run build

# The build folder will contain optimized files ready for deployment
```

Deploy the `build/` folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

---

## 👨‍💻 Author

**Christopher**

- GitHub: [@christo256](https://github.com/christo256)
- Backend: [Habit Tracker API](https://github.com/christo256/S5.02-Web-Application-Habit-Tracker)
- Frontend: [Habit Tracker Frontend](https://github.com/christo256/S5.02-Web-Application-Habit-Tracker-Frontend)

---

## 📄 License

This project is open source and available for educational purposes.

**Built using React and Tailwind CSS**
