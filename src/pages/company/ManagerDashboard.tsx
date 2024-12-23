import { useQuery } from "@tanstack/react-query";
import { File, Users, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentApplicationsList } from "@/components/dashboard/RecentApplicationsList";
import { RecentClientsList } from "@/components/dashboard/RecentClientsList";
import { getCompanyStats, getRecentApplications, getRecentClients } from "@/utils/dashboardStats";

export default function ManagerDashboard() {
  const { companyUsername } = useParams();
  const userEmail = localStorage.getItem("userEmail");

  // Get company ID
  const { data: company } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('company_username', companyUsername)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch manager-specific dashboard data
  const { data: stats } = useQuery({
    queryKey: ['manager-stats', company?.id, userEmail],
    queryFn: () => getCompanyStats(company!.id, 'manager', userEmail!),
    enabled: !!company?.id && !!userEmail
  });

  const { data: recentApplications } = useQuery({
    queryKey: ['manager-recent-applications', company?.id, userEmail],
    queryFn: () => getRecentApplications(company!.id, 'manager', userEmail!),
    enabled: !!company?.id && !!userEmail
  });

  const { data: recentClients } = useQuery({
    queryKey: ['manager-recent-clients', company?.id, userEmail],
    queryFn: () => getRecentClients(company!.id, 'manager', userEmail!),
    enabled: !!company?.id && !!userEmail
  });

  if (!stats || !recentApplications || !recentClients) {
    return <div>Loading...</div>;
  }

  return (
    <CompanyDashboardLayout userRole="manager">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Active Loans"
            value={stats.activeLoans}
            icon={File}
          />
          <StatsCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
          />
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            icon={FileText}
          />
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RecentApplicationsList applications={recentApplications} />
          <RecentClientsList clients={recentClients} />
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}