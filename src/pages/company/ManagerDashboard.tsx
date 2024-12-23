import { useParams } from 'react-router-dom';
import { CompanyDashboardLayout } from '@/components/company/CompanyDashboardLayout';

export default function ManagerDashboard() {
  const { companyUsername } = useParams();

  return (
    <CompanyDashboardLayout userRole="manager">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the manager dashboard for {companyUsername}. 
          This is a placeholder page - content will be added soon.
        </p>
      </div>
    </CompanyDashboardLayout>
  );
}