import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

// 🧩 Page Imports
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import RFQs from "./pages/RFQs";
import UsersRoles from "./pages/UsersRoles";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import EbayAuth from "./pages/EbayAuth";
import Signup from "./pages/Signup"; // ✅ Signup page import
import { AUTH } from "./services/authService"; // ✅ Auth service import

const queryClient = new QueryClient();

/** ✅ Simple auth check using localStorage */
const isAuthenticated = (): boolean => AUTH.getUser() !== null;

/** ✅ ProtectedRoute wrapper */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Signup route (public) */}
          <Route
            path="/signup"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup />
              )
            }
          />
 
          {/* ✅ Protected app layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <DashboardHeader />
                      <main className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/brands" element={<Brands />} />
                          <Route path="/rfqs" element={<RFQs />} />
                          <Route path="/users-roles" element={<UsersRoles />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/ebay/oauth" element={<EbayAuth />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
); 
export default App;
