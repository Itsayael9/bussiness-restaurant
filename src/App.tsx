import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PublicMenuProvider } from "@/contexts/PublicMenuContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { ADMIN_ROUTE } from "@/lib/adminConstants";
import "./i18n";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";
import CategoryDetail from "./pages/CategoryDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

const queryClient = new QueryClient();

const ProtectedAdmin = () => {
  const { ready, user } = useAdminAuth();
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }
  return user ? <AdminDashboard /> : <AdminLogin />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <LanguageProvider>
      <PublicMenuProvider>
        <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster position="top-center" />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categoryId" element={<CategoryDetail />} />
              <Route path={`${ADMIN_ROUTE}/login`} element={<AdminLogin />} />
              <Route path={ADMIN_ROUTE} element={<ProtectedAdmin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </AdminAuthProvider>
      </PublicMenuProvider>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
