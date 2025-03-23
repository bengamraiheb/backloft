
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useState } from "react";

// Layouts
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

// Pages
import Index from "@/pages/Index";
import Board from "@/pages/Board";
import Backlog from "@/pages/Backlog";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import Unauthorized from "@/pages/Unauthorized";

// Auth
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="jira-clone-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" closeButton />
              
              <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    element={
                      <div className="flex min-h-screen bg-background">
                        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <Sidebar open={sidebarOpen} />
                        <div className="flex-1 pt-16 transition-all duration-300 ease-in-out">
                          <main className="min-h-[calc(100vh-64px)]">
                            <Outlet />
                          </main>
                        </div>
                      </div>
                    }
                  >
                    <Route path="/" element={<Navigate to="/board" replace />} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/backlog" element={<Backlog />} />
                    
                    {/* Admin routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                      {/* Add admin routes here */}
                    </Route>
                  </Route>
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
