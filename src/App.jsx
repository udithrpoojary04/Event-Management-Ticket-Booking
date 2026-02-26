import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import EventSearch from './pages/public/EventSearch';
import EventDetail from './pages/public/EventDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Pages
import BookingSummary from './pages/user/BookingSummary';
import Payment from './pages/user/Payment';
import Profile from './pages/user/Profile';
import BookingHistory from './pages/user/BookingHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EventForm from './pages/admin/EventForm';
import EventList from './pages/admin/EventList';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes>
              {/* Auth Layout */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Admin Layout - Protected */}
              <Route
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/events" element={<EventList />} />
                <Route path="/admin/events/new" element={<EventForm />} />
                <Route path="/admin/events/edit/:id" element={<EventForm />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
                <Route path="/admin/revenue" element={<AdminDashboard />} />
              </Route>

              {/* Main Layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventSearch />} />
                <Route path="/events/:id" element={<EventDetail />} />

                {/* Protected User Routes */}
                <Route
                  path="/booking"
                  element={
                    <ProtectedRoute>
                      <BookingSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <BookingHistory />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 */}
              <Route
                path="*"
                element={
                  <MainLayout />
                }
              />
            </Routes>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
