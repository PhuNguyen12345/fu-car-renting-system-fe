import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "./layouts/MainLayout"
import { AdminLayout } from "./layouts/AdminLayout"
import { AdminOverviewTab } from "./pages/AdminOverviewTab"
import { AdminCarsTab } from "./pages/AdminCarsTab"
import { AdminBookingsTab } from "./pages/AdminBookingsTab"
import { AdminUsersTab } from "./pages/AdminUsersTab"
import { AdminReportsTab } from "./pages/AdminReportsTab"
import { AdminLoginPage } from "./pages/AdminLoginPage"
import { LandingPage } from "./pages/LandingPage"
import { AboutPage } from "./pages/AboutPage"
import { CarListingPage } from "./pages/CarListingPage"
import { CarDetailsPage } from "./pages/CarDetailsPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import { BookingSuccessPage } from "./pages/BookingSuccessPage"
import { AuthPage } from "./pages/AuthPage"
import { UserDashboardPage } from "./pages/UserDashboardPage"
import { UserProfileTab } from "./pages/UserProfileTab"
import { UserBookingsTab } from "./pages/UserBookingsTab"
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage"
import { UserSecurityTab } from "./pages/UserSecurityTab"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="cars" element={<CarListingPage />} />
          <Route path="cars/:id" element={<CarDetailsPage />} />
          <Route path="checkout/:id" element={<CheckoutPage />} />
          <Route path="booking-success" element={<BookingSuccessPage />} />
          <Route path="dashboard" element={<UserDashboardPage />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<UserProfileTab />} />
            <Route path="bookings" element={<UserBookingsTab />} />
            <Route path="security" element={<UserSecurityTab />} />
          </Route>
        </Route>
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewTab />} />
          <Route path="cars" element={<AdminCarsTab />} />
          <Route path="bookings" element={<AdminBookingsTab />} />
          <Route path="users" element={<AdminUsersTab />} />
          <Route path="reports" element={<AdminReportsTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
