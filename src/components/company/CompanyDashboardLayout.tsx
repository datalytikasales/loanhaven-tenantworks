import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanySidebar } from "./CompanySidebar";
import { CompanyTopbar } from "./CompanyTopbar";

type UserRole = "client" | "manager" | "admin";

interface CompanyDashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export function CompanyDashboardLayout({ children, userRole }: CompanyDashboardLayoutProps) {
  const navigate = useNavigate();
  const { companyUsername } = useParams();

  const { data: company } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_name, company_logo')
        .eq('company_username', companyUsername)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole !== userRole) {
      navigate("/");
    }
  }, [navigate, userRole]);

  return (
    <div className="flex h-screen bg-gray-100">
      <CompanySidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CompanyTopbar 
          companyLogo={company?.company_logo}
          companyName={company?.company_name}
          userName="John Doe" // This should come from auth
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}