import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { ClientSearch } from "@/components/client/ClientSearch";

export default function ClientProfilePage() {
  return (
    <CompanyDashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Client Profile</h1>
        <ClientSearch />
      </div>
    </CompanyDashboardLayout>
  );
}