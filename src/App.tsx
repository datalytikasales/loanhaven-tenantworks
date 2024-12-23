import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from "./pages/Index";
import Login from "./pages/Login";
import { AdminLayout } from "./components/admin/AdminLayout";
import CreateCompany from "./pages/admin/CreateCompany";
import CompanyReport from "./pages/admin/CompanyReport";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyAbout from "./pages/CompanyAbout";
import ClientDashboard from "./pages/company/ClientDashboard";
import ManagerDashboard from "./pages/company/ManagerDashboard";
import CompanyAdminDashboard from "./pages/company/CompanyAdminDashboard";
import OnboardClient from "./pages/company/OnboardClient";
import OnboardManager from "./pages/company/OnboardManager";
import LoanApplication from "./pages/company/LoanApplication";
import LoanApproval from "./pages/company/LoanApproval";
import LoanSearch from "./pages/company/LoanSearch";
import ClientSearch from "./pages/company/ClientSearch";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<CreateCompany />} />
              <Route path="create-company" element={<CreateCompany />} />
              <Route path="company-report" element={<CompanyReport />} />
            </Route>
            <Route path="/:companyUsername">
              <Route index element={<CompanyLogin />} />
              <Route path="about" element={<CompanyAbout />} />
              
              {/* Client Routes */}
              <Route path="client">
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="loan-application" element={<LoanApplication />} />
              </Route>

              {/* Manager Routes */}
              <Route path="manager">
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="onboard-client" element={<OnboardClient />} />
                <Route path="loan-application" element={<LoanApplication />} />
                <Route path="loan-search" element={<LoanSearch />} />
                <Route path="client-search" element={<ClientSearch />} />
              </Route>

              {/* Company Admin Routes */}
              <Route path="admin">
                <Route path="dashboard" element={<CompanyAdminDashboard />} />
                <Route path="onboard-client" element={<OnboardClient />} />
                <Route path="onboard-manager" element={<OnboardManager />} />
                <Route path="loan-application" element={<LoanApplication />} />
                <Route path="loan-approval" element={<LoanApproval />} />
                <Route path="loan-search" element={<LoanSearch />} />
                <Route path="client-search" element={<ClientSearch />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;