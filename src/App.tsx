
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import Board from "./pages/Board";
import Backlog from "./pages/Backlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-background">
            <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <Sidebar open={sidebarOpen} />
            <div className="flex-1 pt-16 transition-all duration-300 ease-in-out">
              <main className="min-h-[calc(100vh-64px)]">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/backlog" element={<Backlog />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
