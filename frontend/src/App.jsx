import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LinkManagement from './pages/LinkManagement'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import ComplaintManagement from './pages/ComplaintManagement'
import Chat from './pages/Chat'
import UserManagement from './pages/UserManagement'
import SupplierOnboarding from './pages/SupplierOnboarding'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="links" element={<LinkManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="complaints" element={<ComplaintManagement />} />
              <Route path="chat" element={<Chat />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="onboarding" element={<SupplierOnboarding />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

