import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Home from './pages/public/Home';
import EventSearch from './pages/public/EventSearch';
import EventDetail from './pages/public/EventDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';


import BookingSummary from './pages/user/BookingSummary';
import Payment from './pages/user/Payment';
import Profile from './pages/user/Profile';
import BookingHistory from './pages/user/BookingHistory';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes>
              {/* Auth Layout  */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Main Layout  */}
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
